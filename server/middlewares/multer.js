import multer from "multer";

const storage = multer.memoryStorage();

const multerUpload = multer({  storage,/*limits: { fileSize: 1024 * 1024 * 5 }*/ }); //5mb

const singleAvatar = multerUpload.single("avatar");

const attachmentsMulter = multerUpload.array("files", 5);


export { singleAvatar, attachmentsMulter };
