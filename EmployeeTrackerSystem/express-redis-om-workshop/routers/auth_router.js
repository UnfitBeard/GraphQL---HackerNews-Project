import { Router } from "express";
import { adminRepository, personRepository } from "../om/person.js";
import { connection } from "../om/client.js";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config()

export const router = Router()
console.log(process.env['ACCESS_JWT_SECRET'])
const jwtSecret = process.env['ACCESS_JWT_SECRET']

router.put("/register", async (req, res) => {
  try {
    const personExists = await adminRepository
      .search()
      .where("username")
      .equals(req.body.username)
      .return.first();

    if (personExists) {
      res.status(409).send("Username is in use");
      return;
    }

    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const admin = await adminRepository.createAndSave({
      ...req.body,
      password: hashedPassword,
    });

    res.status(201).send(admin.firstname);
  } catch (error) {
    console.log("Error Registering, ", error);
  }
});

router.post("/login", async (req, res) => {
  try {
    const admin = await adminRepository
      .search()
      .where('username')
      .equals(req.body.username)
      .return.first();

    if (!admin) {
      res.status(404).json("Wrong username or password");
      return;
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      admin.password
    );
    if (!validPassword) {
      res.status(401).json("Wrong username or password");
      return;
    }

     //generate the token 
     const payload = {
        entityId:admin.entityId,
        username:admin.username,
    }

    const token = jwt.sign(payload, jwtSecret, {expiresIn: '15m'})

    res.status(201).json({
        username: admin.username,
        token
    });
  } catch (error) {
    console.log("Error Logging in: ", error);
  }
});
