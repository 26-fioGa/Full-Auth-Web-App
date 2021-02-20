import React, {useState} from 'react'
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {showErrMsg, showSuccessMsg} from '../../utils/notification/Notification'
import {isEmpty, isLength, isMatch} from '../../utils/validation/Validation'

const initialState = {
    password: '',
    cf_password: '',
    err: '',
    success: ''
}

function ResetPassword() {
    const [data, setData] = useState(initialState)
    const {token} = useParams()

    const  {password, cf_password, err, success} = data

    const handleChangeInput = e => {
        const {name, value} = e.target
        setData({...data, [name]:value, err:'', success:''})
    }

    const handleResetPass = async () => {

        if(isEmpty(password) || isEmpty(cf_password))
                return setData({...data, err: "Please fill in all fields.", success: ''})

        if(isLength(password))
            return setData({...data, err: "Password must be at least 6 characters.", success: ''})

        if(!isMatch(password, cf_password))
            return setData({...data, err: "Password did not match.", success: ''})

        try {
            const res = await axios.post('/user/reset', {password}, {
                headers: {Authorization: token}
            })

            return setData({...data, err:'', success: res.data.msg})

        } catch (err) {
            err.response.data.msg && setData({...data, err: err.response.data.msg, success: ''})
        }
    }


    return (
        <div className="fg_pass">
            <h2>Reset your password</h2>
            {err && showErrMsg(err)}
            {success && showSuccessMsg(success)}
            <div className="row">           
                <label htmlFor="password">New Password</label>
                <input type="password" name="password" id="password" value={password} onChange={handleChangeInput} />
                <label htmlFor="cf_password">Confirm New Password</label>
                <input type="password" name="cf_password" id="cf_password" value={cf_password} onChange={handleChangeInput} />
                <button onClick={handleResetPass}>Reset Password</button>
            </div>
        </div>
    )
}

export default ResetPassword
