import { useEffect, useState } from 'react'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import classNames from 'classnames/bind'

import styles from './PhoneDetail.module.scss'

const cx = classNames.bind(styles)

function PhoneDetail() {
    const [data, setData] = useState({})

    useEffect(() => {
        axios
            .get('http://localhost:8000/phones/65218825ba2c3c290c1f7a3f')
            .then((res) => {
                setData(res.data.result)
            })
            .catch((err) => console.log(err))
    }, [])

    return (
        <div className={cx('wrapper')}>
            <img
                src={data.image ? `http://localhost:8000/static/image/${data.image}` : ''}
                alt=''
                style={{ width: 500 }}
            />
            <p>{data.name}</p>
            <ReactMarkdown children={data.description} />
        </div>
    )
}

export default PhoneDetail
