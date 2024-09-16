import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { queryDatabase } from "../utils/queryDatabase.js";

const currentDate = new Date();
const CDate = currentDate.toISOString(); 


const AddOutForm = asyncHandler(async (req, res) => {
    const {
        VMob1,
        VMob2,
        VEName,
        VHName,
        VEAddress,
        VHAddress,
        NoOfForms,
        SendingDate,
        ERemarks,
        CMob1,
        CEName,
        CHName,
        loginUserId
    } = req.body;

    try {
        let volunteer = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [VMob1]
        );

        let volunteerId;
        if (volunteer.length > 0) {
            volunteerId = volunteer[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, VEAddress = ?, VHAddress = ?, Mdate=?, MBy=? WHERE id = ?`,
                [VEName, VHName, VEAddress, VHAddress, CDate, loginUserId, volunteerId]
            );
        } else {
       
            const result = await queryDatabase(
                'INSERT INTO volunteer (VMob1, VMob2, VEName, VHName, VEAddress, VHAddress, SBy, MBy, SDate, MDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
                [VMob1, VMob2, VEName, VHName, VEAddress, VHAddress,loginUserId,loginUserId,CDate,CDate]
            );
            volunteerId = result.insertId;
        }

        let volunteer2 = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [CMob1]
        );

        let volunteerId2;
        if (volunteer2.length > 0) {
            volunteerId2 = volunteer2[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, Mdate=?, MBy=? WHERE id = ?`,
                [CEName, CHName,CDate, loginUserId, volunteerId2]
            );
        } else {
          
            const result = await queryDatabase(
                'INSERT INTO volunteer (VMob1, VEName, VHName, SBy, MBy, SDate, MDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [CMob1, CEName, CHName, loginUserId, loginUserId, CDate, CDate]
            );
            volunteerId2 = result.insertId;
        }

        await queryDatabase(
            `INSERT INTO outgoingform (
                RefId,  ERemark, SendingDate, NoOfForms, COID, SBy, MBy, SDate, MDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [volunteerId, ERemarks, SendingDate, NoOfForms,volunteerId2,loginUserId,loginUserId,CDate,CDate ]
        );

        res.status(201).json(
            new ApiResponse(200, "OF details submitted successfully")
        );
    } catch (error) {
        console.error('Error in adding Ougoing form forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const OutFormDetails = asyncHandler(async (req, res) => {

    try {
        let query = `
        SELECT O.Id, v1.VEName AS RName, V1.VHName as RHName, V1.VMob1 AS RMob1, v1.VEAddress AS RAddress,v1.VHAddress AS RHAddress,
        v2.VEName AS C1Name, v2.VHName AS CH1Name , V2.VMob1 as C1Mob, 
        DATE_FORMAT(O.SendingDate, '%d-%m-%Y') AS SendingDate, O.ERemark, O.NoOfForms
        FROM outgoingform AS O
        LEFT JOIN volunteer AS v1 ON O.RefId = v1.Id
        LEFT JOIN volunteer AS v2 ON O.COId = v2.Id
        `;

        let queryParams = [];
        if (req.user.role === 'Forms Admin') {
            query += " WHERE O.SBy = ?";
            queryParams.push(req.user.userid);
        }

        const OutForms = await queryDatabase(query, queryParams);

        return res.json(OutForms);
        // res.status(200).json(new ApiResponse(200, incomingForms, "Fetched all Outgoing forms successfully"));
    } catch (error) {
        console.error('Error in fetching incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const updateOutForm = asyncHandler(async (req, res) => {
    const {
        content,
        VMob1,
        VMob2,
        VEName,
        VHName,
        VEAddress,
        VHAddress,
        NoOfForms,
        SendingDate,
        ERemarks,
        CMob1,
        CEName,
        CHName,
        loginUserId
    } = req.body;

    try {
        let volunteer = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [VMob1]
        );

        let volunteerId;
        if (volunteer.length > 0) {
            volunteerId = volunteer[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, VEAddress = ?, VHAddress = ?, Mdate=?, MBy=? WHERE id = ?`,
                [VEName, VHName, VEAddress, VHAddress, CDate, loginUserId, volunteerId]
            );
        }
         

        let volunteer2 = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [CMob1]
        );

        let volunteerId2;
        if (volunteer2.length > 0) {
            volunteerId2 = volunteer2[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, Mdate=?, MBy=? WHERE id = ?`,
                [CEName, CHName,CDate, loginUserId, volunteerId2]
            );
        }

        await queryDatabase(
            `UPDATE outgoingform SET RefId=?,  ERemark=?, SendingDate=?, NoOfForms=?, COID=?, MBy=?, MDate=? where Id=?`,    
            [volunteerId, ERemarks, SendingDate, NoOfForms,volunteerId2,loginUserId,CDate,content ]
        );

        res.status(201).json(
            new ApiResponse(200, "OF details updated successfully")
        );
    } catch (error) {
        console.error('Error in adding Ougoing form forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddIncomForm = asyncHandler(async (req, res) => {
    const {
        VMob1,
        VMob2,
        VEName,
        VHName,
        VEAddress,
        VHAddress,
        NoOfFormsKN,
        NoOfFormsKD, 
        NoOfFormsU,
        PacketNo,
        ReceivedDate,
        ERemarks,
        COList,
        loginUserId
    } = req.body;
    
  
    try {
        const volunteerQuery = 'SELECT Id FROM volunteer WHERE VMob1 = ?';
        const volunteer = await queryDatabase(volunteerQuery, [VMob1]);

   

        let volunteerId;
        if (volunteer.length > 0) {
            volunteerId = volunteer[0].Id;
           
            const updateVolunteerQuery = `
                UPDATE volunteer 
                SET VEName = ?, VHName = ?, VEAddress = ?, VHAddress = ?, MBy = ?, MDate = ?
                WHERE Id = ?
            `;
            await queryDatabase(updateVolunteerQuery, [VEName, VHName, VEAddress, VHAddress, loginUserId, CDate, volunteerId]);

        } else {
            const insertVolunteerQuery = `
                INSERT INTO volunteer (VMob1, VMob2, VEName, VHName, VEAddress, VHAddress, SBy, MBy, SDate, MDate) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const result = await queryDatabase(insertVolunteerQuery, [VMob1, VMob2, VEName, VHName, VEAddress, VHAddress, loginUserId, loginUserId, CDate, CDate]);

            volunteerId = result.insertId;

        }

        let insertedCareOfIds = [];

        if (COList && Array.isArray(COList) && COList.length > 0) {
            const careOfQueries = COList.map(async (co) => {
                const careOfVolunteerQuery = 'SELECT Id FROM volunteer WHERE VMob1 = ?';
                const careOfVolunteer = await queryDatabase(careOfVolunteerQuery, [co.VMob1]);


                let careOfId;
                if (careOfVolunteer.length > 0) {
                    careOfId = careOfVolunteer[0].Id;
                    
                    const updateCareOfQuery = `
                        UPDATE volunteer 
                        SET VEName = ?, VHName = ?, MBy = ?, MDate = ?
                        WHERE Id = ?
                    `;
                    await queryDatabase(updateCareOfQuery, [co.VEName, co.VHName, loginUserId, CDate, careOfId]);

                } else {
                    const insertCareOfQuery = `
                        INSERT INTO volunteer (VMob1, VEName, VHName, COId, SBy, MBy, SDate, MDate) 
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                    `;
                    const careOfResult = await queryDatabase(insertCareOfQuery, [co.VMob1, co.VEName, co.VHName, volunteerId, loginUserId, loginUserId, CDate, CDate]);

                    careOfId = careOfResult.insertId;

                }
                return careOfId;
            });

            insertedCareOfIds = await Promise.all(careOfQueries);
        }

        const careOfValues = insertedCareOfIds.slice(0, 3);

        while (careOfValues.length < 3) {
            careOfValues.push(null);
        }

        const insertIncomingFormQuery = `
            INSERT INTO incomingform (
                RefId, PacketNo, ERemarks, ReceivedDate, NFormsKN, NFormsKd, NFormsU,
                COID1, COID2, COID3, SBy, MBy, SDate, MDate
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await queryDatabase(insertIncomingFormQuery, [volunteerId, PacketNo, ERemarks, ReceivedDate, NoOfFormsKN, NoOfFormsKD, NoOfFormsU, ...careOfValues, loginUserId, loginUserId, CDate, CDate]);


        res.status(201).json(new ApiResponse(200, "IF details submitted successfully"));
    } catch (error) {
       
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const UpdateIncomForm = asyncHandler(async (req, res) => {
    const {
        VMob1,
        VMob2,
        VEName,
        VHName,
        VEAddress,
        VHAddress,
        NoOfFormsKN,
        NoOfFormsKD, 
        NoOfFormsU,
        PacketNo,
        ReceivedDate,
        ERemarks,
        COList,
        loginUserId,
        content
    } = req.body;

    try {
      
        let volunteer = await queryDatabase(
            'SELECT Id FROM volunteer WHERE VMob1 = ?',
            [VMob1]
        );

        let volunteerId;
        if (volunteer.length > 0) {
            // Update existing volunteer
            volunteerId = volunteer[0].Id;
            await queryDatabase(
                `UPDATE volunteer SET VEName = ?, VHName = ?, VEAddress = ?, VHAddress = ?, Mdate=?, MBy=? WHERE id = ?`,
                [VEName, VHName, VEAddress, VHAddress, CDate, loginUserId, volunteerId]
            );
        } 

        let insertedCareOfIds = [];

        if (COList && Array.isArray(COList) && COList.length > 0) {
            const careOfQueries = COList.map(async (co) => {
                let careOfVolunteer = await queryDatabase(
                    'SELECT Id FROM volunteer WHERE VMob1 = ?',
                    [co.VMob1]
                );

                let careOfId;
                if (careOfVolunteer.length > 0) {
                    // Update existing care_of volunteer
                    careOfId = careOfVolunteer[0].Id;
                    await queryDatabase(
                        `UPDATE volunteer SET VEName = ?, VHName = ?, Mdate=?, MBy=? WHERE Id = ?`,
                        [co.VEName, co.VHName,  loginUserId, CDate, careOfId]
                    );
                }

               
                return careOfId;
            });

            insertedCareOfIds = await Promise.all(careOfQueries);
        }

        const careOfValues = insertedCareOfIds.slice(0, 3); 

        while (careOfValues.length < 3) {
            careOfValues.push(null);
        }


        await queryDatabase(
            `UPDATE incomingform SET
                RefId= ?, ERemarks= ?, ReceivedDate= ?, 
                COID1= ?, COID2= ?, COID3= ?,
                NFormsKN= ?, NFormsKd= ?, NFormsU= ?, Mdate=?, MBy=?,
                PacketNo= ? WHERE Id = ?`,
            [volunteerId, ERemarks, ReceivedDate, ...careOfValues,   NoOfFormsKN,
                NoOfFormsKD, 
                NoOfFormsU, CDate, loginUserId, PacketNo, content]
        );

        res.status(201).json(
            new ApiResponse(200, "IF details Updated successfully")
        );
    } catch (error) {
        console.error('Error in adding incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const incomFormDetails = asyncHandler(async (req, res) => {
    try {
        let query = `
            SELECT v1.Id AS IncRefId, v1.VEName AS RName, V1.VHName AS RHName, V1.VMob1 AS RMob1, v1.VEAddress AS RAddress, V1.VHAddress AS RHAddress,
            i.Id, i.PacketNo, i.NFormsKN, i.NFormsKd, i.NFormsU, DATE_FORMAT(i.ReceivedDate, '%d-%m-%Y') AS ReceivedDate, i.ERemarks,
            v2.VEName AS C1Name, v2.VHName AS C1HName, V2.VMob1 as C1Mob, 
            v3.VEName AS C2Name, v3.VHName AS C2HName, V3.VMob1 as C2Mob, 
            v4.VEName AS C3Name, v4.VHName AS C3HName, V4.VMob1 as C3Mob
            FROM incomingform AS i
            LEFT JOIN volunteer AS v1 ON i.RefId = v1.Id
            LEFT JOIN volunteer AS v2 ON i.COId1 = v2.Id
            LEFT JOIN volunteer AS v3 ON i.COId2 = v3.Id
            LEFT JOIN volunteer AS v4 ON i.COId3 = v4.Id
        `;

        let queryParams = [];
        if (req.user.role === 'Forms Admin') {
            query += " WHERE i.SBy = ?";
            queryParams.push(req.user.userid);
        }

        const incomingForms = await queryDatabase(query, queryParams);

        return res.json(incomingForms);
        // res.status(200).json(new ApiResponse(200, incomingForms, "Fetched all incoming forms successfully"));
    } catch (error) {
        console.error('Error in fetching incoming forms:', error);
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const SearchVMobNo = asyncHandler(async (req, res) => {
    const { query } = req.body;
    // console.log("Received query:", req.body);
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required', query });
    }
    try {
        const results = await queryDatabase(
            `SELECT VMob1, VMob2, VEName, VHName, VEAddress, VHAddress 
            FROM volunteer 
            WHERE VMob1 LIKE ?`,
            [`%${query}%`]
        );


        return res.json(results);
    } catch (error) {
        console.error('Database query error:', error);
        return res.status(500).json({ error: 'A database error occurred.' });
    }
});

const FormsAdminInfo = asyncHandler(async (req, res) => {
    try {
        
        let incomingFormsQuery = `SELECT SUM(NFormsKN) + SUM(NFormsKd) + SUM(NFormsU) AS totalIncomingForms, COUNT(*) AS RefIncForm FROM incomingform`;
        let outgoingFormsQuery = `SELECT SUM(NoOFForms) AS totalOutgoingForms, COUNT(*) AS RefOutForm FROM outgoingform`;
        
        let queryParams = [];

        if (req.user.role === 'Forms Admin') {
            incomingFormsQuery += ` WHERE SBy = ?`;
            outgoingFormsQuery += ` WHERE SBy = ?`;
            queryParams.push(req.user.userid); 
        }

        const [incomingFormsResult] = await queryDatabase(incomingFormsQuery, queryParams);
        const [outgoingFormsResult] = await queryDatabase(outgoingFormsQuery, queryParams);


        const result = {
            totalIncomingForms: incomingFormsResult.totalIncomingForms || 0,
            totalOutgoingForms: outgoingFormsResult.totalOutgoingForms || 0,
            RefIncForm: incomingFormsResult.RefIncForm || 0,
            RefOutForm: outgoingFormsResult.RefOutForm || 0
        };

        return res.json(result); 

    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


export {
    SearchVMobNo,
    AddOutForm, OutFormDetails,updateOutForm,
    AddIncomForm, UpdateIncomForm, incomFormDetails,
    FormsAdminInfo
};
