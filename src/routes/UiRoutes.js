const express = require("express");
const dataController = require('../controller/dataController');
const { uiTotalsDataController } = require("../controller/Ui-Api's/TotalData");
// const { uiSemestersController } = require("../controller/Ui-Api's/Semesters");
const { uiTranscriptController } = require("../controller/Ui-Api's/TranscriptCtr");
const { uiCurrent } = require("../controller/Ui-Api's/Current");
const { uiProgressController } = require("../controller/Ui-Api's/Progress");
const { fetchBlock } = require("../controller/Ui-Api's/BlockTime");
const { QusStuController } = require("../controller/Ui-Api's/Qus-Stu");
const { CheckSubjectsExsController } = require("../controller/Quarries/CheckSubjectsExs");
const { CheckInstractorsExsController } = require("../controller/Quarries/CheckInstractorsExs");

const UiRoutes = express.Router();
UiRoutes.get('/uiTotalsData/:code', uiTotalsDataController);
// UiRoutes.get('/Semesters/:id', uiSemestersController);
UiRoutes.get('/Transcript/:id', uiTranscriptController);
UiRoutes.get('/current', uiCurrent);
UiRoutes.get('/BlockTime', fetchBlock);
UiRoutes.get('/Progress/:code', uiProgressController);
UiRoutes.get('/Qus-Stu/:code', QusStuController);
UiRoutes.get('/Qus-CheckSubjectsExs/:code', CheckSubjectsExsController);
UiRoutes.get('/Qus-CheckInstractorsExs/:code', CheckInstractorsExsController);


module.exports = UiRoutes;