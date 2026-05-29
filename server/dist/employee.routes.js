"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.employeeRouter = void 0;
const express = __importStar(require("express"));
const mongodb_1 = require("mongodb");
const database_1 = require("./database");
exports.employeeRouter = express.Router();
exports.employeeRouter.use(express.json());
exports.employeeRouter.get("/", (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const employees = yield ((_a = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _a === void 0 ? void 0 : _a.find({}).toArray());
        res.status(200).send(employees);
    }
    catch (error) {
        res.status(500).send(error instanceof Error ? error.message : "Unknown error");
    }
}));
exports.employeeRouter.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b, _c, _d;
    try {
        const id = (_b = req === null || req === void 0 ? void 0 : req.params) === null || _b === void 0 ? void 0 : _b.id;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const employee = yield ((_c = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _c === void 0 ? void 0 : _c.findOne(query));
        if (employee) {
            res.status(200).send(employee);
        }
        else {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    }
    catch (error) {
        res.status(404).send(`Failed to find an employee: ID ${(_d = req === null || req === void 0 ? void 0 : req.params) === null || _d === void 0 ? void 0 : _d.id}`);
    }
}));
exports.employeeRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _e;
    try {
        const employee = req.body;
        const result = yield ((_e = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _e === void 0 ? void 0 : _e.insertOne(employee));
        if (result === null || result === void 0 ? void 0 : result.acknowledged) {
            res.status(201).send(`Created a new employee: ID ${result.insertedId}.`);
        }
        else {
            res.status(500).send("Failed to create a new employee.");
        }
    }
    catch (error) {
        console.error(error);
        res.status(400).send(error instanceof Error ? error.message : "Unknown error");
    }
}));
exports.employeeRouter.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _f, _g;
    try {
        const id = (_f = req === null || req === void 0 ? void 0 : req.params) === null || _f === void 0 ? void 0 : _f.id;
        const employee = req.body;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_g = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _g === void 0 ? void 0 : _g.updateOne(query, { $set: employee }));
        if (result && result.matchedCount) {
            res.status(200).send(`Updated an employee: ID ${id}.`);
        }
        else if (!(result === null || result === void 0 ? void 0 : result.matchedCount)) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
        else {
            res.status(304).send(`Failed to update an employee: ID ${id}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}));
exports.employeeRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _h, _j;
    try {
        const id = (_h = req === null || req === void 0 ? void 0 : req.params) === null || _h === void 0 ? void 0 : _h.id;
        const query = { _id: new mongodb_1.ObjectId(id) };
        const result = yield ((_j = database_1.collections === null || database_1.collections === void 0 ? void 0 : database_1.collections.employees) === null || _j === void 0 ? void 0 : _j.deleteOne(query));
        if (result && result.deletedCount) {
            res.status(202).send(`Removed an employee: ID ${id}`);
        }
        else if (!result) {
            res.status(400).send(`Failed to remove an employee: ID ${id}`);
        }
        else if (!result.deletedCount) {
            res.status(404).send(`Failed to find an employee: ID ${id}`);
        }
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        console.error(message);
        res.status(400).send(message);
    }
}));
