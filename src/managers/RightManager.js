import sequelize from "sequelize";
import Right from "../models/Right.js";

export async function GetAllRights() {
    return await Right.findAll();
}

export async function GetAllRightsWhereContaining(or_condition_list, and_not_condition) {
    const condition_sequelize_list = []
    or_condition_list.forEach(function(condition) {
        condition_sequelize_list.push({
            name: {
                [sequelize.Op.like]: `%${condition}%`
            }
        });
    });
    return await Right.findAll({
        where: {
            [sequelize.Op.or] : condition_sequelize_list,
            [sequelize.Op.and] : {
                name: {
                    [sequelize.Op.notLike]: `%${and_not_condition}%`
                }
            }
        }
    })
}

export async function GetRightByName(name) {
    return await Right.findOne({
        where: {
            name: name
        }
    });
}

export async function CountRightsExist(rights) {
    return await Right.count({
        where: {
            name: {
                [sequelize.Op.in]: rights
            }
        }
    });
}

export async function GetAllRightsByName(rights) {
    return await Right.findAll({
        where: {
            name: {
                [sequelize.Op.in]: rights
            }
        }
    });
}

export async function CheckIfRightsExists(right_list) {
    return right_list.length === (await Right.count({
        where: {
            name: {
                [sequelize.Op.in]: right_list
            }
        }
    }));
}