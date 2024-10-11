const express = require('express');
const router = express.Router();
module.exports = router;

const prisma = require("../prisma");

router
    .route('/')
    .get(async (req, res, next) => {
        try {
            const employees = await prisma.employee.findMany();
            res.json(employees);
        } catch (e) {
            next(e);
        }
    })
    .post(async (req, res, next) => {
        const { name } = req.body;
        if (!name) {
            return next({ status: 400, message: "Name of new employee must be provided."});
        }
        try {
            const employee = await prisma.employee.create({
                data: { name }
            })
            res.status(201).json(employee);
        } catch (e) {
            next(e);
        }
    })

router.param("id", async (req, res, next, id) => {
    try {
        const employee = await prisma.employee.findUnique({ where: { id: +id } });
        if (employee) {
            req.employee = employee;
            next();
        } else {
            next({ status: 404, message: `Employee id: ${id} does not exist`});
        }
    } catch (e) {
        next(e);
    }
});

router
    .route("/:id")
    .get(async (req, res) => {
        res.json(req.employee);
    })
    .put(async (req, res, next) => {
        const { name } = req.body;
        if (!name) {
            return next({ status: 400, message: 'The updated employee name must be provided.' });
        }
        try {
            const employee = await prisma.employee.update({
                where: { id: req.employee.id },
                data: { name }
            });
            res.json(employee);
        } catch (e) {
            next(e);
        }
    })
    .delete(async (req, res, next) => {
        try {
            await prisma.employee.delete({
                where: { id: req.employee.id }
            })
            res.sendStatus(204);
        } catch (e) {
            next(e);
        }
    })