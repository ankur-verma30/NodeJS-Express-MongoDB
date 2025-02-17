class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  filter() {
    const queryObj = { ...this.queryString };
    console.log("Request Query object", this.query);
    // 1) simple filtering method
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((element) => delete queryObj[element]);

    // 2) Advanced filtering object containing greater than or less than symbols
    const queryStr = JSON.stringify(queryObj);
    const newQueryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$ ${match}`
    );
    this.query.find(JSON.parse(newQueryStr));
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      console.log("Sort by ", sortBy);
      this.query = this.query.sort(sortBy);
      //sortby(-price rating) //this is taken by mongoose
    } else {
      this.query = this.query.sort("_id");
    }
    return this;
  }
  limiting() {
    if (this.queryString.fields) {
      const fields = this.queryString.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    } else {
      this.query = this.query.select(" ");
    }
    return this;
  }

  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 3;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
