const AsyncHandler = require("express-async-handler");
const express = require('express');
const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');
// const { createSchemaAndTable } = require("../model/UpdateStudentSchema");

exports.AuthReq = AsyncHandler(async (req, res) => {
   
    res.status(200).send('Token received and validated');

});
