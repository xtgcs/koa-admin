const companyController =  require('../controller/companyController')

const billController =  require('../controller/billController')

const router = require('koa-router')()

router.get('/home/list',companyController.getList)

router.post('/company/basicInfo', companyController.getBasicInfo);
router.post('/company/staffInfo', companyController.staffInfo);
router.get('/company/getCorpOrgRank', companyController.getCorpOrgRank);
router.get('/company/getRanks', companyController.getRanks);
router.get('/company/getDepartments', companyController.getDepartments);
router.post('/company/addStaff', companyController.addStaff);
router.post('/company/editorStaff', companyController.editorStaff);
router.post('/company/addRank', companyController.addRank);
router.post('/company/deleteRank', companyController.deleteRank);
router.post('/company/addDepartment', companyController.addDepartment);
router.post('/company/getOrganizations', companyController.getOrganization);
router.post('/bill/sendEmail', billController.sendEmail);

router.get('/a', function (ctx, next) { ctx.body = 'Hello World!'; })

module.exports = router
