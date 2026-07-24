import mongoose from "mongoose";

export async function conectarDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Falta la variable MONGO_URI=mongodb+srv://usuario:contraseña@cluster0.xxxx.mongodb.net/mi_base_de_datos?retryWrites=true&w=majority",
    );
  }
  await mongoose.connect(uri);
  console.log("Conectando a MongoDB");
}
