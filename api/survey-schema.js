// var _ = require("lodash");
// var Joi = require("joi");

// // Must have promptText field
// var Questions = Joi.array()
//   .includes(Joi.object().keys({
//     promptText: Joi.string().required().min(1)
//   }))
//   .min(1);

// var validateNewSurvey = function (survey, callback) {
//   Joi.validate(survey, Questions, callback);
// };

// newSurvey = [
//   {
//     promptText:"Tell me?"
//   },
//   {
//     promptText: "Blockers?"
//   },
//   {
//     promptText: "Achievements"
//   }
// ];

// validateNewSurvey(newSurvey, function (err, data) {
//   console.log(err, "DATA", data);
// });




