exports.isNumber = value => typeof value === "number" && isFinite(value);

exports.logger = (header, table) => {
  console.log(" ");
  console.table(header, table);
};

// exports.setCriteria = (key, value) => {
//         return {
//             [key]: value.toLowerCase().trim()
//         }
//     }

exports.setCriteria = (key1, value, key2 = "optional", i = 0) => {
  try {
    if (value.trim().indexOf(" ") != -1) {
      return [
        {
          [key1]: value
            .toLowerCase()
            .trim()
            .split(" ")[i]
        },
        {
          [key2]: value
            .toLowerCase()
            .trim()
            .split(" ")[i + 1]
        }
      ];
    } else {
      return {
        [key1]: value.toLowerCase().trim()
      };
    }
  } catch (err) {
    console.log(err);
  }
};

exports.setId = (key, arr) => {
  return arr.map(id => {
    return {
      [key]: id.id
    };
  });
};
