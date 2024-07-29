const { pool, connect } = require("../db/dbConnect");
const AsyncHandler = require("express-async-handler");
const fetch = require("node-fetch").default;
const { createSchemaAndTable } = require("../model/StuFeesDataSchema");
require("dotenv").config();
exports.fetshingStuFeesData = AsyncHandler(async (req, res) => {
  let StuId = req.params.StuId;

  // Check if StuId is null or undefined, and set it to 0 if true
  if (StuId === null || StuId === undefined) {
    StuId = 0;
  } else {
    // Convert StuId to a number if it's a string or other type
    StuId = parseInt(StuId, 10);

    // Check if conversion failed and set to 0 if so
    if (isNaN(StuId)) {
      StuId = 0;
    }
  }
  const apiUrl = `${process.env.HORUS_API_DOMAIN}/WSNJ/HUEStuFees?index=StuFeesData&student_id=${StuId}`;
  const client = await connect();

  try {
    // Call the function to create schema and table before fetching data
    await createSchemaAndTable();
    const response = await fetch(apiUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch data from API. Status: ${response.status}`
      );
    }
    const apiData = await response.json();

    const invoices_data = apiData.invoices_data;

    if (invoices_data === "There is no Invoices Unpaid") {
      console.log("API response:", invoices_data);
      // Insert the message into the database
      const insertNoFeeMessageQuery = `
      INSERT INTO StuFeesData.invoices_data (FeeMessage, Stu_ID)
      VALUES ($1, $2)
          ON CONFLICT (ID) DO UPDATE
          SET FeeMessage = $1,
          Stu_ID = $2
      `;

      await client.query(insertNoFeeMessageQuery, [invoices_data, StuId]);

      // Respond with a JSON message
      return res.json({ message: "There is no Invoices Unpaid" });
    } else {
      const SchemaAndTable = "StuFeesData.invoices_data";

      const deleteAllByStuIdQuery = `
      DELETE FROM ${SchemaAndTable}
      WHERE Stu_ID = $1;
    `;
      await client.query(deleteAllByStuIdQuery, [StuId]);

      try {
        for (const item of invoices_data) {
          console.log(item);
          const IDValue = item.ID;
          const Stu_IDValue = StuId;
          const numberValue = item.number;
          const nameValue = item.name;
          const stateValue = item.state;
          const date_dueValue = item.date_due;
          const amountValue = item.amount;
          const currencyValue = item.currency;
          console.log(Stu_IDValue);

          // Insert data into the database (replace 'Levels' with your actual table name)
          const insertQuery = `
        INSERT INTO ${SchemaAndTable} (ID, Stu_ID, number, name, state, date_due, amount, currency) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (ID) DO UPDATE
        SET 
          Stu_ID = $2,
          number = $3, 
          name = $4,
          state = $5,
          date_due = $6,
          amount = $7,
          currency= $8;

      `;
          await client.query(insertQuery, [
            IDValue,
            Stu_IDValue,
            numberValue,
            nameValue,
            stateValue,
            date_dueValue,
            amountValue,
            currencyValue,
          ]);

          console.log("Data inserted into the database successfully");
        }
        const selectQuery = `
  SELECT *
  FROM StuFeesData.invoices_data
  WHERE Stu_ID = $1;
`;

        const result = await client.query(selectQuery, [StuId]);

        res.json(result.rows);
      } catch (error) {
        console.error(error.message);
      }
    }
  } catch (error) {
    console.error("Error querying data:", error.message);

    const selectQuery = `
  SELECT *
  FROM StuFeesData.invoices_data
  WHERE Stu_ID = $1;
`;
    console.log("Getting data from the DB ");
    const result = await client.query(selectQuery, [StuId]);
    if (result.rows.length > 0) {
      const feeMessageValue = result.rows[0].feemessage;

      if (feeMessageValue === "There is no Invoices Unpaid") {
        return res.json({ message: "There is no Invoices Unpaid" });
      } else {
        return res.json(result.rows);
      }
    } else {
      return res.json({ message: "No data found" });
    }
  } finally {
    if (client) {
      client.release();
      console.log('client releases')
    }
  }
});
