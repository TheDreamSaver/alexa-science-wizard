
const quiz = [
  {
    question: "CNG stands for? Converted Natural Gas, Conduced Natural Gas, Conducted Natural Gas or Compressed Natural Gas ",
    answer: "compressed natural gas"
  },
  {
    question: "From which of the following Sound cannot travel through? vaccum, gases, liquids or solids ",
    answer: "vaccum"
  },
  {
    question: "Instrument used for measuring very high temperature is? Pyroscope, Pyrometer, Seismograph or Xylometer ",
    answer: "pyrometer"
  },
  {
    question: "Sound waves are what kind of waves? Transverse, Electromagnetic, Longitudinal or none of these",
    answer: "longitudinal"
  },
  {
    question: "X-rays were discovered by whom? Rontgen, Thomson, Rutherford or Bacquerel ",
    answer: "rontgen"
  }
];



const quizSize = Array.from(Array(quiz.length).keys());

module.exports.quiz = quiz;
module.exports.quizSize = quizSize;








