import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { uploadFiles } from "../middleware/multer.middleware.js";
import { queryDatabase } from "../utils/queryDatabase.js";

const currentDate = new Date();
const SDate = currentDate.toISOString(); 
const MDate = currentDate.toISOString(); 

const searchSurname = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    try {
        const results = await queryDatabase(`SELECT ESurname, HSurname FROM surname WHERE ESurname LIKE ?`, [`%${query}%`]);
        return res.json(results);
    } catch (error) {

        return res.status(500).send('A database error occurred.');
    }
});

const searchCaste = asyncHandler(async (req, res) => {
    const { surname } = req.body;

    if (!surname) {
        return res.status(400).json({ error: 'Surname parameter is required' });
    }

    try {
        const results = await queryDatabase(`SELECT ECaste, caste.Id as CasteId FROM caste jOIN surname ON caste.Id = surname.casteId WHERE ESurname =?`, [surname]);
        return res.json(results);
    } catch (error) {

        return res.status(500).send('A database error occurred.');
    }
});

const searchAreaVill = asyncHandler(async (req, res) => {
    const { query } = req.body;

    const { DId } = req.params;
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const results = await queryDatabase(
            `SELECT DISTINCT EAreaVill, HnoRange FROM areavill 
            INNER JOIN chakblockpanch 
            ON areavill.CBPId = chakblockpanch.id 
            INNER JOIN wardblock 
            ON wardblock.id = chakblockpanch.WBID
            
            JOIN vidhansabha AS V
            ON wardblock.VSID= V.Id
            JOIN council AS C
            ON C.Id= V.counId
            JOIN tehsillist AS T
            ON T.Id= C.TehId
            WHERE T.Did=? AND EAreaVill LIKE ? ORDER BY EAreaVill  `, [DId, `%${query}%`]



        );
        return res.json(results);
    } catch (error) {

        return res.status(500).send('A database error occurred.');
    }
});

const allAreaDetails = asyncHandler(async (req, res) => {
    const { EAreaVill, HnoRange } = req.body;
    const { DId } = req.params;

    if (!EAreaVill) {
        return res.status(400).json({ error: 'EAreaVill parameter is required' });
    }

    try {
        let query = `
        SELECT 
            A.EAreaVill, A.Id, 
            C.ECBPanch, C.Id AS ChkBlkId, C.ChakNo,
            C.WBId, W.EWardBlock, W.WardNo, 
            W.VSId, V.EVidhanSabha, 
            V.counId, cc.ECouncil, 
            cc.TehId, T.EName 
        FROM areavill AS A 
        LEFT JOIN chakblockpanch AS C ON A.CBPId = C.Id 
        LEFT JOIN wardblock AS W ON C.WBId = W.Id 
        LEFT JOIN vidhansabha AS V ON V.ID = W.VSId 
        LEFT JOIN council AS cc ON cc.Id = V.counId 
        LEFT JOIN tehsillist AS T ON T.ID = cc.TehId 
        WHERE A.EAreaVill = ? AND DId=?
    `;

        // If HnoRange is provided, add it to the query
        if (HnoRange === null) {
            query += ` AND A.HnoRange IS NULL`;
        } else {
            query += ` AND A.HnoRange = ?`;
        }

        // Execute the query with the appropriate parameters
        const parameters = HnoRange === null ? [EAreaVill, DId] : [EAreaVill, DId, HnoRange];
        const results = await queryDatabase(query, parameters);


        // const groupedResults = results.reduce((acc, curr) => {
        //     if (!acc[curr.EAreaVill]) {
        //         acc[curr.EAreaVill] = {
        //             chakblocks: [],
        //             wardblocks: [],
        //             vidhansabhas: [],
        //             councils: [],
        //             tehsils: []
        //         };
        //     }

        //     const area = acc[curr.EAreaVill];

        //     if (!area.chakblocks.some(block => block.id === curr.ChkBlkId)) {
        //         area.chakblocks.push({
        //             name: curr.ECBPanch,
        //             id: curr.ChkBlkId
        //         });
        //     }

        //     if (!area.wardblocks.some(block => block.id === curr.WBId)) {
        //         area.wardblocks.push({
        //             name: curr.EWardBlock,
        //             id: curr.WBId
        //         });
        //     }

        //     if (!area.vidhansabhas.some(vidhansabha => vidhansabha.id === curr.VSId)) {
        //         area.vidhansabhas.push({
        //             name: curr.EVidhanSabha,
        //             id: curr.VSId
        //         });
        //     }

        //     if (!area.councils.some(council => council.id === curr.counId)) {
        //         area.councils.push({
        //             name: curr.ECouncil,
        //             id: curr.counId
        //         });
        //     }

        //     if (!area.tehsils.some(tehsil => tehsil.id === curr.TehId)) {
        //         area.tehsils.push({
        //             name: curr.EName,
        //             id: curr.TehId
        //         });
        //     }

        //     return acc;
        // }, {});

        return res.json(results);
    } catch (error) {

        return res.status(500).send('A database error occurred.');
    }
});

const SearchPacketNo = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }
    try {
        const results = await queryDatabase(
            `SELECT DISTINCT PacketNo FROM incomingform WHERE PacketNo LIKE ? LIMIT 10 `,
            [`%${query}%`]
        );
        return res.json(results);


        // res.status(200).json(new ApiResponse(200, incomingForms, "Fetched all incoming forms successfully"));
    } catch (error) {

        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const ReferenceDetails = asyncHandler(async (req, res) => {
    const { PKT } = req.body;

    if (!PKT) {
        return res.status(400).json({ error: 'PKT parameter is required' });
    }
    try {
        const ReferenceDetails = await queryDatabase(`
        SELECT v1.Id As IncRefId, v1.VEName AS RName, V1.VHName AS RHName, V1.VMob1 AS RMob1, v1.VEAddress AS RAddress, V1.VHAddress AS RHAddress,
        v2.VEName AS C1Name,v2.VHName AS C1HName, V2.VMob1 as C1Mob, 
        v3.VEName AS C2Name, v3.VHName AS C2HName, V3.VMob1 as C2Mob, 
        v4.VEName AS C3Name, v4.VHName AS C3HName, V4.VMob1 as C3Mob
        FROM incomingform AS i
        LEFT JOIN volunteer AS v1 ON i.RefId = v1.Id
        LEFT JOIN volunteer AS v2 ON i.COId1 = v2.Id
        LEFT JOIN volunteer AS v3 ON i.COId2 = v3.Id
        LEFT JOIN volunteer AS v4 ON i.COId3 = v4.Id
        WHERE i.PacketNo= ?`, [PKT]);
        return res.json(ReferenceDetails);
        // res.status(200).json(new ApiResponse(200, incomingForms, "Fetched all incoming forms successfully"));
    } catch (error) {

        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const AddVoter = [
    asyncHandler(async (req, res, next) => {
        try {
            // Fetch the maximum IdNo from the database
            const maxIdNoResult = await queryDatabase(`SELECT MAX(Id) AS maxIdNo FROM voterlist`);
            const IdNo = maxIdNoResult && maxIdNoResult.length > 0 && maxIdNoResult[0].maxIdNo !== null ? maxIdNoResult[0].maxIdNo + 1 : 1;

            req.idNo = IdNo; // Set generated IdNo for the voter
            next();
        } catch (error) {

            return res.status(500).json(new ApiResponse(500, null, 'Database query error'));
        }
    }),
    uploadFiles,
    asyncHandler(async (req, res) => {
        try {
            if (!req.body.referenceDetails || !req.body.voterDetails || !req.body.addressDetail) {
                return res.status(400).json(new ApiResponse(400, null, 'Missing required fields in the request body'));
            }


            let referenceDetails, voterDetails, addressDetail,loginIdDetails;
            try {
                referenceDetails = JSON.parse(req.body.referenceDetails);
                voterDetails = JSON.parse(req.body.voterDetails);
                addressDetail = JSON.parse(req.body.addressDetail);
                loginIdDetails=JSON.parse(req.body.loginIdDetails);
            } catch (e) {
                return res.status(400).json(new ApiResponse(400, null, 'Invalid JSON data in the request body'));
            }

            const duplicateCheckQuery = `SELECT * FROM voterlist WHERE EFName = ? AND ELName =? AND ERFName = ? AND ERLName = ?`;
            const duplicateCheckValues = [voterDetails.EFName, voterDetails.ELName, voterDetails.ERFName, voterDetails.ERLName];
            const duplicateResult = await queryDatabase(duplicateCheckQuery, duplicateCheckValues);

            if (duplicateResult.length > 0) {
                return res.status(400).json(new ApiResponse(400, null, 'Duplicate voter entry found'));
            }
            if ( !(voterDetails.AadharNo || voterDetails.VIdNo))
            {
                return res.status(400).json(new ApiResponse(400, null, 'please enter Aadhar No or Voter Id '));
            }


            const voterDocs = {};

            if (req.files['Image']) {
                voterDocs.Image = req.files['Image'][0].filename;
            }
            if (req.files['IdProof']) {
                voterDocs.IdProof = req.files['IdProof'][0].filename;
            }
            if (req.files['Degree']) {
                voterDocs.Degree = req.files['Degree'][0].filename;
            }

            const query = `INSERT INTO voterlist (
                Id, PacketNo, IncFormId, EFName, HFName,
                ELName, HLName, RType, ERFName, HRFName, 
                ERLName, HRLName, CasteId, Qualification, Occupation, 
                Age, DOB, Sex, MNo, MNo2,
                AadharNo, VIdNo, GCYear, DId, AreaId, TehId, 
                CounId, VSId, WBId, ChkBlkId, HNo,
                Landmark, Image, IdProof, Degree,
                StaffId, SBy, MBy, SDate, MDate)
                VALUES (?, ?, ?, ?, 
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?, ?,
                ?, ?, ?, ?, ?,
                ?, ?, ?, ?,
                ?,?,?,?,?)`;

            const values = [
                req.idNo, referenceDetails.PacketNo, referenceDetails.IncRefId, voterDetails.EFName, voterDetails.HFName,
                voterDetails.ELName, voterDetails.HLName, voterDetails.RType, voterDetails.ERFName, voterDetails.HRFName,
                voterDetails.ERLName, voterDetails.HRLName, voterDetails.CasteId, voterDetails.Qualification, voterDetails.Occupation,
                voterDetails.Age, voterDetails.DOB, voterDetails.Sex, voterDetails.MNo, voterDetails.MNo2,
                voterDetails.AadharNo, voterDetails.VIdNo, voterDetails.GCYear, addressDetail.DId, addressDetail.AreaId, addressDetail.TehId,
                addressDetail.counId, addressDetail.VSId, addressDetail.WBId, addressDetail.ChkBlkId, addressDetail.HNo,
                addressDetail.Landmark, voterDocs.Image, voterDocs.IdProof, voterDocs.Degree,
                loginIdDetails.loginId, loginIdDetails.loginId, loginIdDetails.loginId, SDate, MDate
            ];

            await queryDatabase(query, values);
            return res.status(201).json(new ApiResponse(201, null, "Voter added successfully"));
        } catch (error) {

            return res.status(500).json(new ApiResponse(500, null, 'Database insert error'));
        }
    })
];

const UpdateVoter = [
    asyncHandler(async (req, res, next) => {
        try {
            const { idNo } = req.params;

            const currentVoterResult = await queryDatabase(`SELECT * FROM voterlist WHERE Id = ?`, [idNo]);
            if (currentVoterResult.length === 0) {
                return res.status(404).json(new ApiResponse(404, null, 'Voter not found'));
            }

            req.currentVoter = currentVoterResult[0];
            req.idNo = idNo;
            next();
        } catch (error) {

            return res.status(500).json(new ApiResponse(500, null, 'Database query error'));
        }
    }),
    uploadFiles,
    asyncHandler(async (req, res) => {
        try {
            const { referenceDetails, voterDetails, addressDetail } = req.body;

            if (!referenceDetails || !voterDetails || !addressDetail) {
                return res.status(400).json(new ApiResponse(400, null, 'Missing required fields in the request body'));
            }

            // Parse incoming JSON data
            let parsedReferenceDetails, parsedVoterDetails, parsedAddressDetail,loginIdDetails ;
            try {
                parsedReferenceDetails = JSON.parse(referenceDetails);
                parsedVoterDetails = JSON.parse(voterDetails);
                parsedAddressDetail = JSON.parse(addressDetail);
                loginIdDetails=JSON.parse(req.body.loginIdDetails);

            } catch (e) {
                return res.status(400).json(new ApiResponse(400, null, 'Invalid JSON data in the request body'));
            }

            const voterDocs = {};

            if (req.files['Image']) {
                voterDocs.Image = req.files['Image'][0].filename;
            } else {
                voterDocs.Image = req.currentVoter.Image; // Retain current image if not updated
            }
            if (req.files['IdProof']) {
                voterDocs.IdProof = req.files['IdProof'][0].filename;
            } else {
                voterDocs.IdProof = req.currentVoter.IdProof; // Retain current IdProof if not updated
            }
            if (req.files['Degree']) {
                voterDocs.Degree = req.files['Degree'][0].filename;
            } else {
                voterDocs.Degree = req.currentVoter.Degree; // Retain current Degree if not updated
            }

            const query = `UPDATE voterlist SET 
                PacketNo = ?, EFName = ?, HFName = ?, ELName = ?, HLName = ?, 
                RType = ?, ERFName = ?, HRFName = ?, ERLName = ?, HRLName = ?, 
                CasteId = ?, Qualification = ?, Occupation = ?, Age = ?, 
                DOB = ?, Sex = ?, MNo = ?, MNo2 = ?, AadharNo = ?, 
                VIdNo = ?, GCYear = ?, AreaId = ?, TehId = ?, 
                CounId = ?, VSId = ?, WBId = ?, ChkBlkId = ?, 
                HNo = ?, Landmark = ?, Image = ?, IdProof = ?, Degree = ?,
                QCStaff=? ,MBy =?,Mdate=?
                WHERE Id = ?`;

            const values = [
                parsedReferenceDetails.PacketNo, parsedVoterDetails.EFName, parsedVoterDetails.HFName,
                parsedVoterDetails.ELName, parsedVoterDetails.HLName, parsedVoterDetails.RType,
                parsedVoterDetails.ERFName, parsedVoterDetails.HRFName, parsedVoterDetails.ERLName,
                parsedVoterDetails.HRLName, parsedVoterDetails.CasteId, parsedVoterDetails.Qualification,
                parsedVoterDetails.Occupation, parsedVoterDetails.Age, parsedVoterDetails.DOB,
                parsedVoterDetails.Sex, parsedVoterDetails.MNo, parsedVoterDetails.MNo2,
                parsedVoterDetails.AadharNo, parsedVoterDetails.VIdNo, parsedVoterDetails.GCYear,
                parsedAddressDetail.AreaId, parsedAddressDetail.TehId, parsedAddressDetail.CounId,
                parsedAddressDetail.VSId, parsedAddressDetail.WBId, parsedAddressDetail.ChkBlkId,
                parsedAddressDetail.HNo, parsedAddressDetail.Landmark,
                voterDocs.Image, voterDocs.IdProof, voterDocs.Degree,
                loginIdDetails.loginId, loginIdDetails.loginId,MDate,
                req.params.idNo // The ID to update
            ];

            await queryDatabase(query, values);
            return res.status(200).json(new ApiResponse(200, null, "Voter updated successfully"));
        } catch (error) {

            return res.status(500).json(new ApiResponse(500, null, 'Database update error'));
        }
    })
];

const getPerseemanDetails = asyncHandler(async (req, res) => {
    const { ChakNo, ECBPanch, EAreaVill } = req.body;

    if (!ChakNo && !ECBPanch && !EAreaVill) {
        return res.status(400).json({ error: 'At least one of chakNo, ECBPanch, or EAreaVill is required.' });
    }

    try {
        let query = `
            SELECT CBP.ChakNo, CBP.ECBPanch, AV.EAreaVill, WB.WardNo
            FROM chakblockpanch AS CBP 
            JOIN areavill AS AV ON CBP.Id = AV.CBPId 
            JOIN wardblock AS WB ON WB.Id = CBP.WBId
            WHERE 1 = 1`;

        const params = [];

        if (EAreaVill) {
            query += " AND (AV.EAreaVill LIKE ? OR AV.EAreaVill IS NULL OR AV.EAreaVill = '')";
            params.push(`%${EAreaVill}%`);
        }
        if (ChakNo) {
            query += " AND (CBP.ChakNo = ? OR CBP.ChakNo IS NULL OR CBP.ChakNo = '')";
            params.push(ChakNo);
        }
        if (ECBPanch) {
            query += " AND (CBP.ECBPanch = ? OR CBP.ECBPanch IS NULL OR CBP.ECBPanch = '')";
            params.push(ECBPanch);
        }

        const results = await queryDatabase(query, params);

        res.json(results);
    } catch (error) {

        res.status(500).send('A database error occurred.');
    }
});

const ChakNoBlock = asyncHandler(async (req, res) => {
    try {
        const result = await queryDatabase('select ECBPanch, ChakNo FROM chakblockpanch')

        return res.json(result);

    }
    catch (error) {
        return res.status(500).send('A database error occured ok');
    }
})


export {
    SearchPacketNo, ReferenceDetails, searchSurname, searchCaste,
    searchAreaVill, allAreaDetails,
    AddVoter, UpdateVoter,
    getPerseemanDetails, ChakNoBlock
};
