"use strict";

const { users } = require("../seedData");

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.bulkInsert("Users", users, { transaction });
      const myUsers = await queryInterface.sequelize.query(
        `SELECT * FROM USERS WHERE email = "${users[0].email}";`,
        { transaction }
      );
      console.log(myUsers);
      const testUserId = myUsers[0][0].id;
      console.log(testUserId);
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      console.log(err);
    }
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.bulkDelete("Records", null, { transaction });
      await queryInterface.bulkDelete("Users", null, { transaction });
      await transaction.commit();
    } catch (err) {
      console.log(err);
      await transaction.rollback();
    }
  },
};
