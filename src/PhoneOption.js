import classNames from 'classnames/bind'

import styles from './PhoneOption.module.scss'

const cx = classNames.bind(styles)

function PhoneOption({ data }) {
    return (
        <>
            <div className={cx('wrapper')}>
                {data && (
                    <div className={cx('option')}>
                        <img
                            className={cx('image')}
                            src={`http://localhost:8000/static/image/${data.images[0]}`}
                            alt=''
                        ></img>
                        <p className={cx('line')}>Dung lượng: {data.capacity}</p>
                        <p className={cx('line')}>Màu sắc: {data.color}</p>
                        <p className={cx('line')}>Giá: {data.price}</p>
                        <p className={cx('line')}>Giá gốc: {data.price_before_discount}</p>
                        <p className={cx('line')}>Số lượng: {data.quantity}</p>
                    </div>
                )}
            </div>
        </>
    )
}

export default PhoneOption
