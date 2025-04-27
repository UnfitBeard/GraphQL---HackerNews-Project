import { Router } from "express";
import { personRepository } from "../om/person.js";

export const router = Router()

router.get('/all', async(req, res) => {
    const persons = await personRepository.search().return.all()
    res.send(persons)
})

router.get('/by-last-name/:lastName', async (req, res) => {
    const lastName = req.params.lastName
    const persons = await personRepository.search()
    .where('lastName').equals(lastName).return.all();
    res.send(persons)
    //same as equal
    // const persons = await personRepository.search().where('lastName').does.equal(lastName).return.all()

    //This one is for is not equal to
    // const persons = await personRepository.search().where('lastName').is.not.equalTo(lastName).return.all()

    //also not equal to
    // const persons = await personRepository.search().where('lastName').does.not.equal(lastName).return.all()

})

