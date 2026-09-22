import generateResponse from "../config/openRouter.js";
import User from "../models/userModel.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

export const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT AND SENIOR UI/UX ENGINEER.
YOU BUILD PRODUCTION-GRADE, CLIENT-DELIVERABLE WEBSITES USING ONLY HTML, CSS, AND JAVASCRIPT.

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR:
- Modern, clean, professional UI with consistent typography, colors, and whitespace.
- Fully responsive: Mobile (<768px), Tablet (768px-1024px), Desktop (>1024px).
- Output ONE single complete HTML file (<!DOCTYPE html><html>...</html>).
- Exactly ONE <style> tag and exactly ONE <script> tag.
- NO external CSS/JS libraries or fonts. Use modern CSS (Grid, Flexbox) and system fonts.
- Use high-quality Unsplash images: [https://images.unsplash.com/](https://images.unsplash.com/)... with ?auto=format&fit=crop&w=1200&q=80
- SPA-style navigation with JavaScript switching pages (Home, About, Services/Features, Contact).
- At least one page must have .active (display: block) on initial load.

JSON FORMAT REQUIREMENTS (NON-NEGOTIABLE):
You must output ONLY a valid RAW JSON object.
Use single quotes for HTML attributes wherever possible (e.g. <div class='hero'>) to prevent string escaping issues.
Schema:
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL DOCUMENT HTML VALID>"
}
`;

// 1. Generate Website Controller
export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits",
      });
    }

    const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt.trim());

    let raw = "";
    let parsed = null;

    // 2 attempts with prompt reinforcement
    for (let i = 0; i < 2; i++) {
      raw = await generateResponse(
        i === 0
          ? finalPrompt
          : `${finalPrompt}\n\nIMPORTANT: Return ONLY a valid RAW JSON object with keys "message" and "code".`
      );

      parsed = extractJson(raw);
      if (parsed && parsed.code) {
        break;
      }
    }

    if (!parsed || !parsed.code) {
      console.error("AI response invalid or unparseable.");
      return res.status(500).json({
        success: false,
        message: "AI generated an invalid response. Please try again.",
      });
    }

    const website = await Website.create({
      user: user.id,
      title: prompt.trim().slice(0, 60),
      latestCode: parsed.code,
      conversation: [
        {
          role: "user",
          content: prompt.trim(),
        },
        {
          role: "ai",
          content: parsed.message || "Website generated successfully.",
        },
      ],
    });

    user.credits -= 50;
    await user.save();

    return res.status(200).json({
      success: true,
      website,
      remaining_credits: user.credits,
    });
  } catch (error) {
    console.error("Error in generateWebsite:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error from generateWebsite",
    });
  }
};

// 2. Get Website By ID
export const getWebsiteById = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    return res.status(200).json({
      success: true,
      website,
    });
  } catch (error) {
    console.error("Error in getWebsiteById:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error from getWebsiteById",
    });
  }
};

// 3. Website Changes / Editor Chat Controller
export const wesbsiteChanges = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const user = await User.findById(req.user._id);
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.credits < 25) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits",
      });
    }

    const updatePrompt = `YOU ARE A SENIOR WEB DEVELOPER.
UPDATE THIS HTML WEBSITE ACCORDING TO THE USER REQUEST.

CURRENT HTML CODE:
${website.latestCode}

USER REQUEST:
${prompt.trim()}

CRITICAL RULES:
- Return ONLY a valid RAW JSON object matching this schema:
{
  "message": "Short summary of changes made",
  "code": "<UPDATED DOCUMENT FULL HTML VALID>"
}
- Use single quotes for HTML attributes where possible to keep JSON clean.
- Never output markdown code blocks.`;

    let raw = "";
    let parsed = null;

    for (let i = 0; i < 2; i++) {
      raw = await generateResponse(
        i === 0
          ? updatePrompt
          : `${updatePrompt}\n\nIMPORTANT: Return valid raw JSON only.`
      );

      parsed = extractJson(raw);
      if (parsed && parsed.code) {
        break;
      }
    }

    if (!parsed || !parsed.code) {
      console.error("AI response invalid during websiteChanges.");
      return res.status(500).json({
        success: false,
        message: "AI generated an invalid response. Please try again.",
      });
    }

    website.conversation.push(
      {
        role: "user",
        content: prompt.trim(),
      },
      {
        role: "ai",
        content: parsed.message || "Changes applied successfully.",
      }
    );

    website.latestCode = parsed.code;
    await website.save();

    user.credits -= 25;
    await user.save();

    return res.status(200).json({
      success: true,
      message: parsed.message,
      latestCode: parsed.code,
      remaining_credits: user.credits,
    });
  } catch (error) {
    console.error("Error in wesbsiteChanges:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error from wesbsiteChanges",
    });
  }
};

// 4. Get All Websites
export const getAllWebsite = async (req, res) => {
  try {
    const websites = await Website.find({
      user: req.user._id,
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      success: true,
      websites,
    });
  } catch (error) {
    console.error("Error in getAllWebsite:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error from getAllWebsite",
    });
  }
};

// 5. Deploy Website
export const deploy = async (req, res) => {
  try {
    const website = await Website.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found",
      });
    }

    if (!website.slug) {
      const slug =
        website.title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .slice(0, 60) + "-" + website._id.toString().slice(-5);

      website.slug = slug;
    }

    website.deployed = true;
    website.deployUrl = `${process.env.FRONT_END_URL}/site/${website.slug}`;

    await website.save();

    return res.status(200).json({
      success: true,
      message: "Website deployed successfully",
      url: website.deployUrl,
      website: {
        id: website._id,
        title: website.title,
        slug: website.slug,
        deployUrl: website.deployUrl,
        deployed: website.deployed,
      },
    });
  } catch (error) {
    console.error("Error in deploy:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error from deploy",
    });
  }
};

// 6. Get Deployed Website By Slug
export const getBySlug = async (req, res) => {
  try {
    const website = await Website.findOne({
      slug: req.params.slug,
      deployed: true,
    }).select("title slug latestCode deployed deployUrl");

    if (!website) {
      return res.status(404).json({
        success: false,
        message: "Website not found or not deployed",
      });
    }

    return res.status(200).json({
      success: true,
      website,
    });
  } catch (error) {
    console.error("Error in getBySlug:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error from getBySlug",
    });
  }
};