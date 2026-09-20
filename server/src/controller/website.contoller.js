import generateResponse from "../config/openRouter.js";
import User from "../models/userModel.js";
import Website from "../models/website.model.js";
import extractJson from "../utils/extractJson.js";

const masterPrompt = `
YOU ARE A PRINCIPAL FRONTEND ARCHITECT
AND A SENIOR UI/UX ENGINEER
SPECIALIZED IN RESPONSIVE DESIGN SYSTEMS.

YOU BUILD HIGH-END, REAL-WORLD, PRODUCTION-GRADE WEBSITES
USING ONLY HTML, CSS, AND JAVASCRIPT
THAT WORK PERFECTLY ON ALL SCREEN SIZES.

THE OUTPUT MUST BE CLIENT-DELIVERABLE WITHOUT ANY MODIFICATION.

❌ NO FRAMEWORKS
❌ NO LIBRARIES
❌ NO BASIC SITES
❌ NO PLACEHOLDERS
❌ NO NON-RESPONSIVE LAYOUTS

--------------------------------------------------
USER REQUIREMENT:
{USER_PROMPT}
--------------------------------------------------

GLOBAL QUALITY BAR (NON-NEGOTIABLE)
--------------------------------------------------
- Premium, modern UI (2026–2027)
- Professional typography & spacing
- Clean visual hierarchy
- Business-ready content (NO lorem ipsum)
- Smooth transitions & hover effects
- SPA-style multi-page experience
- Production-ready, readable code

--------------------------------------------------
RESPONSIVE DESIGN (ABSOLUTE REQUIREMENT)
--------------------------------------------------
THIS WEBSITE MUST BE FULLY RESPONSIVE.

YOU MUST IMPLEMENT:

✔ Mobile-first CSS approach
✔ Responsive layout for:
  - Mobile (<768px)
  - Tablet (768px–1024px)
  - Desktop (>1024px)

✔ Use:
  - CSS Grid / Flexbox
  - Relative units (%, rem, vw)
  - Media queries

✔ REQUIRED RESPONSIVE BEHAVIOR:
  - Navbar collapses / stacks on mobile
  - Sections stack vertically on mobile
  - Multi-column layouts become single-column on small screens
  - Images scale proportionally
  - Text remains readable on all devices
  - No horizontal scrolling on mobile
  - Touch-friendly buttons on mobile

IF THE WEBSITE IS NOT RESPONSIVE → RESPONSE IS INVALID.

--------------------------------------------------
IMAGES (MANDATORY & RESPONSIVE)
--------------------------------------------------
- Use high-quality images ONLY from:
  https://images.unsplash.com/
- EVERY image URL MUST include:
  ?auto=format&fit=crop&w=1200&q=80

- Images must:
  - Be responsive (max-width: 100%)
  - Resize correctly on mobile
  - Never overflow containers

--------------------------------------------------
TECHNICAL RULES (VERY IMPORTANT)
--------------------------------------------------
- Output ONE single HTML file
- Exactly ONE <style> tag
- Exactly ONE <script> tag
- NO external CSS / JS / fonts
- Use system fonts only
- iframe srcdoc compatible
- SPA-style navigation using JavaScript
- No page reloads
- No dead UI
- No broken buttons
--------------------------------------------------
SPA VISIBILITY RULE (MANDATORY)
--------------------------------------------------
- Pages MUST NOT be hidden permanently
- If .page { display: none } is used,
  then .page.active { display: block } is REQUIRED
- At least ONE page MUST be visible on initial load
- Hiding all content is INVALID


--------------------------------------------------
REQUIRED SPA PAGES
--------------------------------------------------
- Home
- About
- Services / Features
- Contact

--------------------------------------------------
FUNCTIONAL REQUIREMENTS
--------------------------------------------------
- Navigation must switch pages using JS
- Active nav state must update
- Forms must have JS validation
- Buttons must show hover + active states
- Smooth section/page transitions

--------------------------------------------------
FINAL SELF-CHECK (MANDATORY)
--------------------------------------------------
BEFORE RESPONDING, ENSURE:

1. Layout works on mobile, tablet, desktop
2. No horizontal scroll on mobile
3. All images are responsive
4. All sections adapt properly
5. Media queries are present and used
6. Navigation works on all screen sizes
7. At least ONE page is visible without user interaction

IF ANY CHECK FAILS → RESPONSE IS INVALID

--------------------------------------------------
OUTPUT FORMAT (RAW JSON ONLY)
--------------------------------------------------
{
  "message": "Short professional confirmation sentence",
  "code": "<FULL VALID HTML DOCUMENT>"
}

--------------------------------------------------
ABSOLUTE RULES
--------------------------------------------------
- RETURN RAW JSON ONLY
- NO markdown
- NO explanations
- NO extra text
- FORMAT MUST MATCH EXACTLY
- IF FORMAT IS BROKEN → RESPONSE IS INVALID
`;

// generate website
export const generateWebsite = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User is not logged in  user not found",
      });
    }

    if (user.credits < 50) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits",
      });
    }

    const finalPrompt = masterPrompt.replace("{USER_PROMPT}", prompt);

    let raw = ``;
    let parsed = null;

    for (let i = 0; i < 2; i++) {
      raw = await generateResponse(
        i === 0 ? finalPrompt : finalPrompt + "\n\n RETURN ONLY RAW JSON.",
      );

      parsed = extractJson(raw);

      if (parsed) {
        break;
      }
    }

    if (!parsed || !parsed.code) {
      console.log("ai response invalid response");

      return res.status(500).json({
        message: "ai invalid respose",
      });
    }

    const website = await Website.create({
      user: user.id,
      title: prompt.slice(0, 60),
      latestCode: parsed.code,
      conversation: [
        {
          role: "ai",
          content: parsed.message,
        },
        {
          role: "user",
          content: prompt,
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
    console.log(`this error come from generateWebsite ${error}`);

    return res.status(500).json({
      success: false,
      message: "Internal server error from generateWebsite",
    });
  }
};

// get website by id
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
    console.log(`this error come from getWebsiteById ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error  from getWebsiteById",
    });
  }
};

// wesbsite changes controller

export const wesbsiteChanges = async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
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
      return res.status(400).json({
        success: false,
        message: "User is not logged in user not found",
      });
    }

    if (user.credits < 25) {
      return res.status(400).json({
        success: false,
        message: "Insufficient credits",
      });
    }

    const updatePrompt = `UPDATE THE HTML WEBSITE.

CURRENT CODE:
${website.latestCode}

USER REQUEST:
${prompt}

RETURN RAW JSON ONLY:
{
  "message": "short confirmation",
  "code": "<UPDATED FULL VALID HTML>"
}`;

    let raw = "";
    let parsed = null;

    for (let i = 0; i < 2; i++) {
      raw = await generateResponse(
        i === 0 ? updatePrompt : updatePrompt + "\n\nRETURN ONLY RAW JSON.",
      );

      parsed = extractJson(raw);

      if (parsed) {
        break;
      }
    }

    if (!parsed || !parsed.code) {
      console.log("ai response invalid response");

      return res.status(500).json({
        success: false,
        message: "ai invalid response",
      });
    }

    website.conversation.push(
      {
        role: "user",
        content: prompt,
      },
      {
        role: "ai",
        content: parsed.message,
      },
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
    console.log("this error came from wesbsiteChanges:", error);

    return res.status(500).json({
      success: false,
      message: "internal server error from wesbsiteChanges",
    });
  }
};

// get all wesbite by user
export const getAllWebsite = async (req, res) => {
  try {
    const websites = await Website.find({
      user: req.user._id,
    });

    return res.status(200).json({
      success: true,
      websites,
    });
  } catch (error) {
    console.log("this error came from getAllWebsite:", error);

    return res.status(500).json({
      success: false,
      message: "internal server error from getAllWebsite",
    });
  }
};

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

    // Generate slug only once
    if (!website.slug) {
      const slug =
        website.title
          .toLowerCase()
          .trim()
          .replace(/\s+/g, "-")
          .replace(/[^a-z0-9-]/g, "")
          .replace(/-+/g, "-")
          .slice(0, 60) + website._id.toString().slice(-5);

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
    console.log("This error came from deploy:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error from deploy",
    });
  }
};

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
    console.log("This error came from getBySlug:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error from getBySlug",
    });
  }
};

// export const generateDemo = async (req, res) => {
//     try {
//         const result = await generateResponse("hello");

//         const data = await extractJson(result);

//         res.status(200).json({
//             data,
//         });
//     } catch (error) {
//         console.log("Error in generateDemo:", error);

//         res.status(500).json({
//             success: false,
//             message: "Failed to generate response",
//         });
//     }
// };
