import multer from 'multer'

const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(new Error('Tipo de arquivo inválido. Apenas JPEG, PNG e JPG são aceitos'), false)
    }
}

export const uploadConfig = multer({
    storage: storage,
    limits: {
        fileSize: 4 * 1024 * 1024
    },
    fileFilter: fileFilter
})