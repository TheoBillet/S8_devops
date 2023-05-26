import TrainerRight from "../models/TrainerRight.js";

export async function AddRightToTrainer(right, trainer) {    
    return await TrainerRight.Create({
        login_trainer: trainer.login,
        id_right: right.id
    });
}

export async function AddRightsToTrainer(right_list, trainer) {   
    const trainer_right_list = []
    right_list.forEach(function(right) {
        trainer_right_list.push({
            login_trainer: trainer.login,
            id_right: right.id});
    });
    return await TrainerRight.bulkCreate(trainer_right_list,
        {
            ignoreDuplicates: true
        }
    );
}

export async function TrainerHasRight(right, trainer) {
    return await TrainerRight.findOne({
        where: {
            login_trainer: trainer.login,
            id_right: right.id
        }
    });
}

export async function DeleteAllRightsToTrainer(trainer) {
    return await TrainerRight.destroy({
        where: {
            login_trainer: trainer.login
        }
    });
}