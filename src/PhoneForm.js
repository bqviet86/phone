import { useState, useEffect } from 'react'
import classNames from 'classnames/bind'
import axios from 'axios'
import MdEditor from 'react-markdown-editor-lite'
import MarkdownIt from 'markdown-it'

import 'react-markdown-editor-lite/lib/index.css'
import styles from './PhoneForm.module.scss'
import PhoneOption from './PhoneOption'
import Modal from './Modal'

const cx = classNames.bind(styles)
const mdParser = new MarkdownIt()
const plugins = [
    'header',
    'font-bold',
    'font-italic',
    'font-underline',
    'font-strikethrough',
    'list-unordered',
    'list-ordered',
    'block-quote',
    'block-wrap',
    'block-code-inline',
    'block-code-block',
    'table',
    'image',
    'clear',
    'logger',
    'mode-toggle',
    'full-screen'
]

function PhoneForm() {
    const [formData, setFormData] = useState({
        name: '',
        image: '',
        options: [],
        description: '',
        brand: '',
        screen_type: '',
        resolution: '',
        operating_system: '',
        memory: '',
        chip: '',
        battery: '',
        rear_camera: '',
        front_camera: '',
        wifi: '',
        jack_phone: '',
        size: '',
        weight: ''
    })
    const [formDataOption, setFormDataOption] = useState({
        capacity: '',
        color: '',
        price: 0,
        price_before_discount: 0,
        quantity: 0,
        images: []
    })
    const [brands, setBrands] = useState([])
    const [selectedBrand, setSelectedBrand] = useState('')
    const [uploadImageValue, setUploadImageValue] = useState('Chọn ảnh')
    const [selectedImage, setSelectedImage] = useState('')
    const [showOptionForm, setShowOptionForm] = useState(false)
    const [uploadImageValueOption, setUploadImageValueOption] = useState('Chọn ảnh')
    const [selectedImageOption, setSelectedImageOption] = useState([])
    const [options, setOptions] = useState([])
    const [description, setDescription] = useState('')

    useEffect(() => {
        // Gọi API để lấy danh sách các brand
        axios
            .get('http://localhost:8000/brands')
            .then((response) => {
                setBrands(response.data.result)
            })
            .catch((error) => {
                console.error('Lỗi khi lấy danh sách brand:', error)
            })
    }, [])

    const handleSetValue = (e) => {
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleBrandChange = (event) => {
        setSelectedBrand(event.target.value)
    }

    const handleMdEditorChange =
        (set) =>
        ({ html, text }) => {
            set(text)
        }

    const handleUploadImage = (event) => {
        const file = event.target.files[0]
        const formData = new FormData()

        formData.append('image', file)
        axios
            .post('http://localhost:8000/medias/upload-image', formData)
            .then((response) => {
                setUploadImageValue(response.data.message)
                setSelectedImage(response.data.result[0].url)
            })
            .catch((error) => {
                setUploadImageValue(error.response.data.message)
            })
    }

    const handleUploadImageMdEditor = (file) => {
        return new Promise((resolve) => {
            const formData = new FormData()

            formData.append('image', file)
            axios
                .post('http://localhost:8000/medias/upload-image', formData)
                .then((response) => {
                    setUploadImageValue(response.data.message)
                    resolve(response.data.result[0].url)
                })
                .catch((error) => {
                    setUploadImageValue(error.response.data.message)
                })
        })
    }

    const handleSetValueOption = (e) => {
        setFormDataOption((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleShowForm = () => {
        setShowOptionForm(true)
    }

    const handleCloseForm = () => {
        setShowOptionForm(false)
    }

    const handleUploadImageOption = (event) => {
        const files = event.target.files
        const formData = new FormData()

        for (let i = 0; i < files.length; i++) {
            formData.append('image', files[i])
        }

        axios
            .post('http://localhost:8000/medias/upload-image', formData)
            .then((response) => {
                setUploadImageValueOption(response.data.message)
                setSelectedImageOption(response.data.result)
            })
            .catch((error) => {
                setUploadImageValueOption(error.response.data.message)
            })
    }

    function chuyenChuoiSangSo(chuoi) {
        // Loại bỏ tất cả dấu chấm trong chuỗi
        var soKhongDauCham = chuoi.replace(/\./g, '')

        // Chuyển chuỗi đã loại bỏ dấu chấm thành số
        var so = Number(soKhongDauCham)

        return so
    }

    const handleSubmitOption = (event) => {
        event.preventDefault()

        // Chuẩn bị dữ liệu để gửi lên API
        const dataToSend = {
            ...formDataOption,
            price: chuyenChuoiSangSo(formDataOption.price),
            price_before_discount: chuyenChuoiSangSo(formDataOption.price_before_discount),
            quantity: Number(formDataOption.quantity),
            images: selectedImageOption.map((image) => image.url.split('/').slice(-1)[0])
        }

        console.log('dataOptionToSend', dataToSend)

        // Gọi API để tạo option mới
        axios
            .post('http://localhost:8000/phones/options', dataToSend)
            .then((response) => {
                console.log('Option đã được tạo thành công:', response.data)
                setOptions((prev) => [...prev, response.data.result])
                setShowOptionForm(false)
            })
            .catch((error) => {
                console.error('Lỗi khi tạo option:', error.response.data)
            })
    }

    const handleSubmit = (event) => {
        event.preventDefault()

        // Chuẩn bị dữ liệu để gửi lên API
        const dataToSend = {
            ...formData,
            brand: selectedBrand,
            image: selectedImage.split('/').slice(-1)[0],
            options: options.map((option) => option._id),
            description
        }

        console.log('dataToSend', dataToSend)

        // Gọi API để tạo điện thoại mới
        axios
            .post('http://localhost:8000/phones', dataToSend)
            .then((response) => {
                console.log('Điện thoại đã được tạo thành công:', response.data)
            })
            .catch((error) => {
                console.error('Lỗi khi tạo điện thoại:', error.response.data)
            })
    }

    return (
        <div className={cx('wrapper')}>
            <div className={cx('wrap')}>
                <h2>Tạo điện thoại mới</h2>
                <form className={cx('form')} onSubmit={handleSubmit}>
                    <h4>Name</h4>
                    <input name='name' placeholder='Tên điện thoại' value={formData.name} onChange={handleSetValue} />

                    <h4>Thương hiệu</h4>
                    <select value={selectedBrand} onChange={handleBrandChange}>
                        <option value=''>Chọn brand</option>
                        {brands.map((brand) => (
                            <option key={brand._id} value={brand._id}>
                                {brand.name}
                            </option>
                        ))}
                    </select>

                    <h4>Hình ảnh</h4>
                    <input
                        type='file'
                        id='img_phone'
                        accept='image/*'
                        className={cx('input-file')}
                        onChange={handleUploadImage}
                    />
                    <label htmlFor='img_phone'>{uploadImageValue}</label>
                    {selectedImage && (
                        <img src={selectedImage} alt='Selected' style={{ width: 200, margin: '16px auto 0' }} />
                    )}

                    <h4>Thêm option của điện thoại</h4>
                    <div className={cx('phone-option')}>
                        {options.map((option) => (
                            <PhoneOption key={option._id} data={option} />
                        ))}
                        <div className={cx('add-option-btn')} onClick={handleShowForm}>
                            +
                        </div>
                    </div>

                    <Modal title={'Tạo option mới'} showModal={showOptionForm} closeModal={handleCloseForm}>
                        <div className={cx('form', 'options')}>
                            <h4>Dung lượng</h4>
                            <input
                                name='capacity'
                                placeholder='Dung lượng'
                                value={formDataOption.capacity}
                                onChange={handleSetValueOption}
                            />

                            <h4>Màu sắc</h4>
                            <input
                                name='color'
                                placeholder='Màu sắc'
                                value={formDataOption.color}
                                onChange={handleSetValueOption}
                            />

                            <h4>Giá</h4>
                            <input
                                name='price'
                                placeholder='Giá'
                                value={formDataOption.price}
                                onChange={handleSetValueOption}
                            />

                            <h4>Giá gốc</h4>
                            <input
                                name='price_before_discount'
                                placeholder='Giá gốc'
                                value={formDataOption.price_before_discount}
                                onChange={handleSetValueOption}
                            />

                            <h4>Số lượng</h4>
                            <input
                                name='quantity'
                                placeholder='Số lượng'
                                value={formDataOption.quantity}
                                onChange={handleSetValueOption}
                            />

                            <h4>Hình ảnh</h4>
                            <input
                                type='file'
                                id='img_phone_option'
                                accept='image/*'
                                multiple='multiple'
                                className={cx('input-file')}
                                onChange={handleUploadImageOption}
                            />
                            <label htmlFor='img_phone_option'>{uploadImageValueOption}</label>
                            {selectedImageOption.length ? (
                                <img
                                    src={selectedImageOption[0].url}
                                    alt='Selected'
                                    style={{ width: 200, margin: '16px auto 0' }}
                                />
                            ) : (
                                ''
                            )}

                            <button type='submit' onClick={handleSubmitOption}>
                                Tạo option
                            </button>
                        </div>
                    </Modal>

                    <h4>Mô tả</h4>
                    <MdEditor
                        className={cx('md-editor')}
                        plugins={plugins}
                        renderHTML={(text) => mdParser.render(text)}
                        value={description}
                        onChange={handleMdEditorChange(setDescription)}
                        // imageAccept='image/png, image/gif, image/jpeg, image/bmp, image/x-icon'
                        onImageUpload={handleUploadImageMdEditor}
                    />

                    <h4>Loại màn hình</h4>
                    <input
                        name='screen_type'
                        placeholder='Loại màn hình'
                        value={formData.screen_type}
                        onChange={handleSetValue}
                    />

                    <h4>Độ phân giải</h4>
                    <input
                        name='resolution'
                        placeholder='Độ phân giải'
                        value={formData.resolution}
                        onChange={handleSetValue}
                    />

                    <h4>Hệ điều hành</h4>
                    <input
                        name='operating_system'
                        placeholder='Hệ điều hành'
                        value={formData.operating_system}
                        onChange={handleSetValue}
                    />

                    <h4>Ram</h4>
                    <input name='memory' placeholder='Bộ nhớ' value={formData.memory} onChange={handleSetValue} />

                    <h4>Chip</h4>
                    <input name='chip' placeholder='Chip' value={formData.chip} onChange={handleSetValue} />

                    <h4>Pin</h4>
                    <input name='battery' placeholder='Pin' value={formData.battery} onChange={handleSetValue} />

                    <h4>Camera sau</h4>
                    <input
                        name='rear_camera'
                        placeholder='Camera sau'
                        value={formData.rear_camera}
                        onChange={handleSetValue}
                    />

                    <h4>Camera trước</h4>
                    <input
                        name='front_camera'
                        placeholder='Camera trước'
                        value={formData.front_camera}
                        onChange={handleSetValue}
                    />

                    <h4>Wifi</h4>
                    <input name='wifi' placeholder='Wifi' value={formData.wifi} onChange={handleSetValue} />

                    <h4>Jack tai nghe</h4>
                    <input
                        name='jack_phone'
                        placeholder='Jack tai nghe'
                        value={formData.jack_phone}
                        onChange={handleSetValue}
                    />

                    <h4>Kích thước</h4>
                    <input name='size' placeholder='Kích thước' value={formData.size} onChange={handleSetValue} />

                    <h4>Trọng lượng</h4>
                    <input name='weight' placeholder='Trọng lượng' value={formData.weight} onChange={handleSetValue} />

                    <button type='submit'>Tạo điện thoại</button>
                </form>
            </div>
        </div>
    )
}

export default PhoneForm
