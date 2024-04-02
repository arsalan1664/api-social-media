import multer, { diskStorage } from "multer";

export const upload = multer({
  storage: diskStorage({
    destination: "uploads/", // Adjust the upload directory path
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  },
  limits: { fileSize: 1024 * 1024 * 50 }, // Adjust file size limit
});
