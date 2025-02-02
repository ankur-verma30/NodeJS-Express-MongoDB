const fs = require("fs");

const tours = JSON.parse(fs.readFileSync(`${__dirname}/../tours.json`));

exports.getAllTours = (req, res) => {
  console.log("Time taken:", req.responseTime);
  return res.status(200).json({
    status: "success",
    results: tours.tours.length,
    message: "All Tours",
    data: tours.tours,
  });
};

exports.createTour = (req, res) => {
  const newId = tours.tours[tours.tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.tours.push(newTour);

  fs.writeFile(`${__dirname}/../tours.json`, JSON.stringify(tours), (err) => {
    if (err) {
      return res.status(500).json({
        status: "fail",
        message: "Internal Server Error",
      });
    }
    res.status(201).json({
      status: "success",
      message: "Tour added successfully",
      data: {
        tour: newTour,
      },
    });
  });
};

exports.getToursById = (req, res) => {
  console.log("Time taken:", req.requestTime);
  console.log(req.params);
  const id = Number(req.params.id);
  // const tour=tours.tours.find((element)=>element.id===id); now we can directly send tour we find through the find method
  //can use find method to find the id of the parameter and find method will return the array with the id of the parameter
  return res.status(200).json({
    requestedAt: req.requestTime,
    status: "success",
    results: tours.tours.length,
    message: "All Tours",
    data: tours.tours[id - 1],
  });
};

exports.updatedTours = (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Patch request successfull",
    data: {
      tours: "<Updated Tours Here...>",
    },
  });
};

exports.deleteTours = (req, res) => {
  res.status(204).json({
    status: "success",
    data: null,
  });
};
