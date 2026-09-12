import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'
const UseGetCurrentUser = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        const GetCurrentUser = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/user/me`, { withCredentials: true })
                console.log(result.data.user)
                dispatch(setUserData(result.data.user))
            } catch (error) {
                console.log(error)
            }
        }
        GetCurrentUser()
    }, [])

}

export default UseGetCurrentUser