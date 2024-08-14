import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { queryDatabase } from '../utils/queryDatabase.js';


const currentDate = new Date();
const SDate = currentDate.toISOString(); 
const MDate = currentDate.toISOString(); 

const AddCaste = asyncHandler(async (req, res) => {
    const { ESurname, HSurname, ECaste, HCaste, loginUserId } = req.body;
    if (!ESurname || !HSurname || !ECaste || !HCaste) {
        throw new ApiError(400, "Please enter all details!")
    }

    try {
        const existCaste = await queryDatabase('SELECT Id FROM caste WHERE ECaste = ?',[ECaste]);
        let CasteId; 
        if (existCaste.length>0) {
         CasteId = existCaste[0].Id;
        }
        else{
            const result= await queryDatabase(
                'INSERT INTO caste (ECaste, HCaste, SBy, MBy, SDate, MDate) VALUES (?, ?, ?, ?, ?, ?)',
                [ECaste, HCaste, loginUserId, loginUserId, SDate, MDate]
            );
            CasteId = result.insertId;
        }
      
        await queryDatabase(
            'INSERT INTO surname (ESurname, HSurname, CasteId , SBy, MBy, SDate, MDate) VALUES (?, ?, ?,?,?,?, ?)',
            [ESurname, HSurname, CasteId, loginUserId, loginUserId, SDate, MDate]
        );

        const addedCaste = {
            ESurname, HSurname, ECaste, HCaste
        };

        return res.status(201).json(
            new ApiResponse(200, addedCaste, "caste details submitted successfully")
        );
    } catch (error) {
        
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const casteDetails = asyncHandler(async (req, res) => {
    try {
        const results = await queryDatabase('SELECT surname.Id, caste.ECaste, caste.HCaste, surname.ESurname, surname.HSurname FROM caste RIGHT JOIN surname ON surname.casteId= caste.Id');
        return res.json(results); // Should correctly return the results array
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateCasteDetail = asyncHandler(async (req, res) => {
    const { ID, ESurname, HSurname, ECaste, HCaste, loginUserId } = req.body;
    if (!ID || !ESurname || !HSurname || !ECaste || !HCaste) {
        throw new ApiError(400, "Please enter all details!")
    }
    console.log(loginUserId)
    try {  
        const existCaste = await queryDatabase('SELECT Id FROM caste WHERE ECaste = ?',[ECaste]);
        let CasteId; 
        if (existCaste.length>0) {
         CasteId = existCaste[0].Id;
        }
        else{
            const result= await queryDatabase(
                'INSERT INTO caste (ECaste, HCaste, SBy, MBy,MDate,SDate) VALUES (?, ?, ?,?,?,?)',
                [ECaste, HCaste, loginUserId, loginUserId,MDate,SDate]
            );
            CasteId = result.insertId;
        }

        await queryDatabase(
            'UPDATE surname SET ESurname= ?, HSurname= ?, casteId= ?, MBy=?,MDate=? WHERE ID= ?',
            [ESurname, HSurname, CasteId,loginUserId,MDate, ID ]
        );

        const updatedCaste = {
            ID, ESurname, HSurname, ECaste, HCaste
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCaste, "Caste details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddTehsil = asyncHandler(async (req, res) => {
    const {DId}= req.params;
    const { EName, HName, loginUserId} = req.body;
    if (!EName || !HName) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'INSERT INTO tehsillist (EName, HName, Did, SBy, MBy,SDate,MDate) VALUES (?, ?,?,?,?,?,?)',
            [EName, HName, DId, loginUserId, loginUserId,SDate,MDate]
        );

        const addedTehsil = {
            EName, HName
        };

        return res.status(201).json(
            new ApiResponse(200, addedTehsil, "Tehsil details submitted successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const TehsilDetails = asyncHandler(async (req, res) => {
    try {
        const {DId} = req.params;
        const results = await queryDatabase(`SELECT * FROM tehsillist WHERE Did =?`,[DId]);
        return res.json(results); // Should correctly return the results array
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateTehsilDetail = asyncHandler(async (req, res) => {
    const { Id, EName, HName, loginUserId } = req.body;
    if (!Id || !EName || !HName) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE Tehsillist SET EName= ?, HName= ?, MBy=?,MDate=? WHERE Id= ?',
            [EName, HName, loginUserId,MDate, Id]
        );

        const updatedCaste = {
            EName, HName, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCaste, "Tehsil details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const DeleteTehsilDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    if (!Id) {
        return res.status(400).json({ error: "Id is required" });
    }
    try {
        await queryDatabase(
            'DELETE FROM tehsillist WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "Tehsil details Deleted successfully")
        );
    } catch (error) {
        
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddCouncil = asyncHandler(async (req, res) => {
    const { ECouncil, HCouncil, TehId, loginUserId } = req.body;

    if (!ECouncil || !HCouncil || !TehId)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO council (TehId, ECouncil, HCouncil, SBy, MBy,SDate,MDate) VALUES (?, ?, ?,?,?,?,?)',
            [TehId, ECouncil, HCouncil,loginUserId, loginUserId,SDate,MDate]
        );

        const AddedCouncil = {
            TehId, ECouncil, HCouncil
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "Tehsil details submitted successfully")
        );

    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const CouncilDetails = asyncHandler(async (req, res) => {
    const {DId}= req.params;
    try {
        const results = await queryDatabase(`SELECT council.*, tehsillist.EName FROM tehsillist RIGHT JOIN council ON council.TehId = tehsillist.Id WHERE tehsillist.Did=?`,[DId]);

        return res.json(results); // Should correctly return the results array
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateCouncilDetail = asyncHandler(async (req, res) => {
    const { Id, TehId, ECouncil, HCouncil, loginUserId } = req.body;
    if (!Id, !TehId || !ECouncil || !HCouncil) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE council SET ECouncil= ?, HCouncil= ?, TehId= ?, MBy=?,MDate=? WHERE Id= ?',
            [ECouncil, HCouncil, TehId, loginUserId, MDate,Id]
        );

        const updatedCouncil = {
            ECouncil, HCouncil, TehId
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCouncil, "Council details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});


const DeleteCouncilDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    try {
        await queryDatabase(
            'DELETE FROM council WHERE Id= ?',
            [Id]
        );
        return res.status(201).json(
            new ApiResponse(200, "council details Deleted successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddVidhanSabha = asyncHandler(async (req, res) => {
    const { EVidhanSabha, HVidhanSabha, VSNo, counId, loginUserId } = req.body;



    if (!EVidhanSabha || !HVidhanSabha || !counId || !VSNo)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO vidhansabha (counId, EVidhanSabha, HVidhanSabha, VSNo, SBy, MBy,SDate,MDate) VALUES (?, ?, ?, ?, ?, ?,?,?)',
            [counId, EVidhanSabha, HVidhanSabha, VSNo, loginUserId, loginUserId,SDate,MDate]
        );
        const AddedCouncil = {
            counId, EVidhanSabha, HVidhanSabha, VSNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "Tehsil details submitted successfully")
        );

    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const VidhanSabhaDetails = asyncHandler(async (req, res) => {
    const {DId}= req.params;
    try {
        const results = await queryDatabase(`SELECT vidhansabha.*, council.ECouncil, tehsillist.EName, tehsillist.Id as TehId FROM vidhansabha INNER JOIN council ON vidhansabha.counId = council.id INNER JOIN tehsillist ON tehsillist.id = council.TehId WHERE tehsillist.Did= ?`,[DId]);

        return res.json(results); // Should correctly return the results array
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateVidhanSabhaDetail = asyncHandler(async (req, res) => {
    // counId, EVidhanSabha, HVidhanSabha, VSNo
    const { Id, counId, EVidhanSabha, HVidhanSabha, VSNo, loginUserId } = req.body;

    if (!Id, !counId || !EVidhanSabha || !HVidhanSabha || !VSNo) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE vidhansabha SET EVidhanSabha= ?, HVidhanSabha= ?, VSNo =?, counId =?, MBy=?, MDate =? WHERE Id= ?',
            [EVidhanSabha, HVidhanSabha, VSNo, counId, loginUserId, MDate, Id]
        );

        const updatedVS = {
            EVidhanSabha, HVidhanSabha, VSNo, counId, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedVS, "VidhanSabha details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteVidhanSabhaDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;


    try {
        await queryDatabase(
            'DELETE FROM VidhanSabha WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "VidhanSabha details Deleted successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddWardBlock = asyncHandler(async (req, res) => {
    const { EWardBlock, HWardBlock, WardNo, VSId, loginUserId } = req.body;

    if (!EWardBlock || !HWardBlock || !WardNo || !VSId)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO wardblock (VSId, EWardBlock, HWardBlock, WardNo, SBy, MBy,SDate,MDate) VALUES (?, ?, ?, ?, ?, ?,?,?)',
            [VSId, EWardBlock, HWardBlock, WardNo, loginUserId, loginUserId,SDate,MDate]
        );

        const AddedCouncil = {
            VSId, EWardBlock, HWardBlock, WardNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "wardblock details submitted successfully")
        );

    } catch (error) {
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const WardBlockDetails = asyncHandler(async (req, res) => {
    const {DId}= req.params;
    try {
        const results = await queryDatabase(`
            SELECT WB.Id, WB.VSId, WB.WardNo, WB.EWardBlock, WB.HWardBlock, vidhansabha.EVidhanSabha 
            FROM wardblock AS WB
             INNER JOIN vidhansabha 
             ON vidhansabha.Id = WB.VSId 
             JOIN council AS C
             ON vidhansabha.counId= C.Id
             JOIN tehsillist AS T
             ON T.Id = C.TehId
             WHERE T.Did=?
             ORDER BY WB.WardNo`, [DId]);

        return res.json(results);
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateWardBlockDetail = asyncHandler(async (req, res) => {

    const { Id, VSId, WardNo, EWardBlock, HWardBlock, loginUserId } = req.body;
    if (!Id, !VSId || !EWardBlock || !WardNo || !HWardBlock) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE wardblock SET EWardBlock= ?, HWardBlock= ?, VSId= ?, WardNo=?, MBy=?,Mdate=? WHERE Id= ?',
            [EWardBlock, HWardBlock, VSId, WardNo, loginUserId,MDate, Id]
        );

        const updatedCouncil = {
            EWardBlock, HWardBlock, VSId, WardNo, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCouncil, "wardblock details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteWardBlockDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;


    try {
        await queryDatabase(
            'DELETE FROM wardblock WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "council details Deleted successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddChakBlock = asyncHandler(async (req, res) => {
    console.log("first");
    const { ECBPanch, HCBPanch, ChakNo, WBId, loginUserId } = req.body;

    if (!ECBPanch || !HCBPanch || !ChakNo || !WBId)
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO chakblockpanch (WBId, ECBPanch, HCBPanch, ChakNo, SBy, MBy,SDate,MDate) VALUES (?, ?, ?, ?, ?,?,?, ?)',
            [WBId, ECBPanch, HCBPanch, ChakNo, loginUserId, loginUserId,SDate,MDate]
        );

        const AddedCouncil = {
            WBId, ECBPanch, HCBPanch, ChakNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "ChakBlock details submitted successfully")
        );

    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const ChakBlockDetails = asyncHandler(async (req, res) => {
    const {DId}= req.params;
    try {
        const results = await queryDatabase(`
            SELECT chakblockpanch.*, wardblock.EWardBlock 
            FROM chakblockpanch 
            INNER JOIN wardblock 
            ON wardblock.Id = chakblockpanch.WBId
            JOIN vidhansabha AS V
            ON wardblock.VSID= V.Id
            JOIN council AS C
            ON C.Id= V.counId
            JOIN tehsillist AS T
            ON T.Id= C.TehId
            WHERE T.Did=?`,[DId]);

        return res.json(results);
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateChakBlockDetail = asyncHandler(async (req, res) => {

    const { Id, WBId, ChakNo, ECBPanch, HCBPanch, loginUserId } = req.body;
    if (!Id, !WBId || !ChakNo || !ECBPanch || !HCBPanch) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE chakblockpanch SET ECBPanch= ?, HCBPanch= ?, WBId= ?, ChakNo=?, MBy=?,MDate=? WHERE Id= ?',
            [ECBPanch, HCBPanch, WBId, ChakNo,loginUserId,MDate,  Id]
        );

        const updatedCouncil = {
            ECBPanch, HCBPanch, WBId, ChakNo, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedCouncil, "wardblock details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteChakBlockDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    try {
        await queryDatabase(
            'DELETE FROM chakblockpanch WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "council details Deleted successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddAreaVill = asyncHandler(async (req, res) => {
    
    const { EAreaVill, HAreaVill, HnoRange, CBPId, loginUserId } = req.body;
   
    if (!EAreaVill || !HAreaVill || !CBPId )
        throw new ApiError(400, 'Plaese Enter All the Details')


    try {
        await queryDatabase(
            'INSERT INTO areavill (CBPId, EAreaVill, HAreaVill, HnoRange, SBy, MBy,SDate,MDate) VALUES (?, ?, ?, ?,?, ?,?,?)',
            [CBPId, EAreaVill, HAreaVill, HnoRange, loginUserId, loginUserId,SDate,MDate]
        );
        const AddedCouncil = {
            CBPId, EAreaVill, HAreaVill, HnoRange
        }
        return res.status(201).json(
            new ApiResponse(200, AddedCouncil, "Tehsil details submitted successfully")
        );

    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AreaVillDetails = asyncHandler(async (req, res) => {
    const {DId}= req.params;
    try {
        const results = await queryDatabase(`
            SELECT areavill.*, chakblockpanch.ECBPanch, wardblock.EWardBlock, wardblock.Id as WBId 
            FROM areavill 
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
            WHERE T.Did=?`,[DId]);

        return res.json(results); 
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdateAreaVillDetail = asyncHandler(async (req, res) => {
    const { Id, CBPId, EAreaVill, HAreaVill, HnoRange, loginUserId } = req.body;
    console.log(req.body);
    if (!Id, !CBPId || !EAreaVill || !HAreaVill ) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        const ans= await queryDatabase(
            'UPDATE areavill SET EAreaVill= ?, HAreaVill= ?, HnoRange =?, CBPId =?, MBy=?,SDate=?,MDate=? WHERE Id= ?',
            [EAreaVill, HAreaVill, HnoRange, CBPId, loginUserId,SDate,MDate,Id]
        );
 
        const updatedVS = {
            EAreaVill, HAreaVill, HnoRange, CBPId, Id
        };

        return res.status(201).json(
            new ApiResponse(200, updatedVS, "VidhanSabha details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeleteAreaVillDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;
    
    try {
        await queryDatabase(
            'DELETE FROM areavill WHERE Id= ?',
            [Id]
        );


        return res.status(201).json(
            new ApiResponse(200, "areavill details Deleted successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const AddPSList = asyncHandler(async (req, res) => {
    const { ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo, loginUserId, DId } = req.body;
   
    if (!ESPArea || !HSPArea || !PSNo || !ESPName || !HSPName || !RoomNo ||!DId)
        throw new ApiError(400, 'Plaese Enter All the Details')
    try {
        await queryDatabase(
            'INSERT INTO pollingstation (EPSArea, HPSArea, PSNo, EPSName, HPSName, RoomNo, SBy, MBy,SDate,MDate, DId) VALUES (?, ?, ?,?, ?, ?,?,?,?,?,?)',
            [ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo, loginUserId, loginUserId,SDate,MDate, DId]
        );
        const AddedPSList = {
            HSPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo
        }
        return res.status(201).json(
            new ApiResponse(200, AddedPSList, "PSList details submitted successfully")
        );

    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const PSListDetails = asyncHandler(async (req, res) => {
const{DId}=req.params;
    try {
        const results = await queryDatabase(`SELECT Id, EPSArea, HPSArea, PSNo, EPSName, HPSName, RoomNo FROM pollingstation where DId= ?`,[DId])
    
        return res.json(results);
    } catch (error) {
         
        return res.status(500).send('A database error occurred.');
    }
});

const UpdatePSListDetail = asyncHandler(async (req, res) => {

    const { content, ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo, loginUserId } = req.body;

    if (!content || !ESPArea || !HSPArea || !PSNo || !ESPName || !HSPName || !RoomNo) {
        throw new ApiError(400, "Please enter all details!")
    }
    try {
        await queryDatabase(
            'UPDATE pollingstation SET EPSArea= ?, HPSArea= ?, PSNo =?, EPSName =?, HPSName=?, RoomNo=?, MBy=?, MDate=? WHERE Id= ?',
            [ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo, loginUserId, MDate, content]
        );

        const updatedPSList = {
             ESPArea, HSPArea, PSNo, ESPName, HSPName, RoomNo
        };

        return res.status(201).json(
            new ApiResponse(200, updatedPSList, "PSList details Updated successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const DeletePSListDetail = asyncHandler(async (req, res) => {
    const { Id } = req.body;

    try {
        await queryDatabase(
            'DELETE FROM pollingstation WHERE Id= ?',
            [Id]
        );
        return res.status(201).json(
            new ApiResponse(200, "Ps details Deleted successfully")
        );
    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});

const WardVotersCount=asyncHandler(async(req,res)=>{
    const {WBId} = req.body;
    

    if (!WBId )
        throw new ApiError(400, 'Plaese Enter All the Details')

    try {
        const result=await queryDatabase(
            // SELECT COUNT(*) AS TotalVoters FROM `voterlist` WHERE WBId = 5;
            'SELECT COUNT(*) AS TotalVoters FROM voterlist WHERE WBId = ?',
            [WBId]
        );
        
        return res.status(201).json(
            new ApiResponse(200, result, "voters fetched successfully")
        );

    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
})

const SearchPSNo = asyncHandler(async (req, res) => {
    const { query } = req.body;
    
    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required', query });
    }
    try {
        const results = await queryDatabase(
            'SELECT Id AS PSId, PSNo, EPSName, RoomNo FROM pollingstation WHERE PSNo LIKE ? LIMIT 10',
            [`%${query}%`]
        );
        return res.json(results);
    } catch (error) {
     
        return res.status(500).json({ error: 'A database error occurred.' });
    }
});

const addPSA = asyncHandler(async (req, res) => {
    const { PSId, WBId,VtsFrom, VtsTo, loginUserId } = req.body;

    if (!PSId || !WBId || !VtsFrom || !VtsTo || !loginUserId)
        throw new ApiError(400, 'Plaese Enter All the Details')
    try {
        await queryDatabase(
            'INSERT INTO pstationallot (PSId, WId, VtsFrom, VtsTo, SBy, MBy, SDate, MDate) VALUES (?, ?,?, ?, ?,?,?,?)',
            [PSId, WBId, VtsFrom, VtsTo, loginUserId, loginUserId, SDate, MDate, ]
        );
        const AddedPSList = {
            PSId, WBId,VtsFrom, VtsTo, loginUserId 
        }
        return res.status(201).json(
            new ApiResponse(200, AddedPSList, "PS Allotted successfully")
        );

    } catch (error) {
         
        return res.status(error.statusCode || 500).json(new ApiResponse(error.statusCode || 500, null, error.message || "Internal Server Error"));
    }
});



const pSAllotDetails = asyncHandler(async (req, res) => {
    const{DId}=req.params;
        try {
            const results = await queryDatabase(`SELECT PSA.Id, PSA.VtsFrom, PSA.VtsTo, 
                PSL.EPSArea, PSL.PSNo, PSL.EPSName, PSL.RoomNo,
                wb.WardNo,wb.EWardBlock
                FROM pstationallot AS PSA 
                JOIN pollingstation AS PSL
                 ON PSA.PSId= PSL.Id
                 JOIN wardblock AS wb
                 ON wb.Id=PSA.WId`)
            return res.json(results);
        } catch (error) {
             
            return res.status(500).send('A database error occurred.');
        }
    });

const deletePSA=asyncHandler(async(req,res)=>{
        const {Id}=req.body;
        console.log(Id)
        try{
            const result=await queryDatabase(`Delete FROM pstationallot where Id=?`,[Id] )
            return res.json(result);
        }catch(error){
            return res.status(500).send('A database error occured.')
        }
    });

export {
    AddCaste, casteDetails, UpdateCasteDetail,
    AddTehsil, TehsilDetails, UpdateTehsilDetail, DeleteTehsilDetail,
    AddCouncil, CouncilDetails, UpdateCouncilDetail, DeleteCouncilDetail,
    AddVidhanSabha, VidhanSabhaDetails, UpdateVidhanSabhaDetail, DeleteVidhanSabhaDetail,
    AddWardBlock, WardBlockDetails, UpdateWardBlockDetail, DeleteWardBlockDetail,
    AddChakBlock, ChakBlockDetails, UpdateChakBlockDetail, DeleteChakBlockDetail,
    AddAreaVill, AreaVillDetails, UpdateAreaVillDetail, DeleteAreaVillDetail,
    AddPSList, PSListDetails, UpdatePSListDetail, DeletePSListDetail, SearchPSNo,
    WardVotersCount, addPSA, pSAllotDetails,deletePSA
}

