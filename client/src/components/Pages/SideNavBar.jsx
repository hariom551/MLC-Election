import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoMdHome } from "react-icons/io";
import { FaUserGroup } from "react-icons/fa6"
import { FaBuildingColumns } from "react-icons/fa6";;
import { IoLogOutSharp } from "react-icons/io5";
import { FaLocationDot } from "react-icons/fa6";
import axios from 'axios'
function SideNavBar({ show }) {
    const [dropdownStates, setDropdownStates] = useState({
        users: false,
        outgoing: false,
        incoming: false,
        pariseeman: false,
        SubAdmin: false,
        Caste: false,
        Reporters: false,
        PollingStation: false,
        voterList: false,
        Form: false,
        VoterL: false,
        Staff: false,
        forms: false,
        Telecaller: false,

    });

    const toggleDropdown = (dropdown) => {
        setDropdownStates(prevState => ({
            ...prevState,
            [dropdown]: !prevState[dropdown]
        }));
    };

    const handleLogout = async () => {
        try {
            const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/v1/users/logoutuser`)
            if (response.data.success) {
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                window.location.href = '/';
            }
        } catch (error) {
            console.log(error.message)
        }

    };

    const user = JSON.parse(localStorage.getItem("user"));
    const role = user ? user.role : "";
    const permission = user.permissionaccess;


    return (
        <div className={show ? 'sidenav active' : 'sidenav'}>
            <div className="navbar">
                <ul>
                    <li><h5><b> MAIN NAVIGATION</b></h5></li>
                </ul>

                {role === 'Super Admin' && (
                    <div className="superadmin-link">
                        <ul>
                            <li ><Link to="/Home" className='flex items-center gap-2'><IoMdHome className='text-2xl' />Home</Link></li>
                        </ul>
                        <ul>
                            <li><Link to="/district" className='flex items-center gap-2'><FaBuildingColumns />District</Link></li>
                        </ul>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('users')}>
                                <FaUserGroup className='text-xl' /> Users <span className="dropdown-symbol">{dropdownStates.users ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.users ? 'show' : ''}`} id="users-dropdown-content">
                                <ul><li><Link to={{ pathname: "/userForm", search: "?content=Forms Admin" }}>Forms Admin</Link></li></ul>
                                <ul><li><Link to={{ pathname: "/userForm", search: "?content=Admin" }}>Admin</Link></li></ul>
                                {/* <ul><li><Link to={{ pathname: "/userForm", search: "?content=Vidhansabha Admin" }}>Vidhansabha Admin</Link></li></ul> */}
                            </div>
                        </div>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('outgoing')}>
                                <FaUserGroup className='text-xl' />Out./Inc.List <span className="dropdown-symbol">{dropdownStates.outgoing ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.outgoing ? 'show' : ''}`} id="outgoing-dropdown-content">
                                <ul><li><Link to="/outgoingForms">Outgoing List</Link></li></ul>
                                <ul><li><Link to="/incomingForms">Incoming List</Link></li></ul>
                            </div>
                        </div>
                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('publish')}>
                                <FaUserGroup className='text-xl' />publish <span className="dropdown-symbol">{dropdownStates.publish ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.publish ? 'show' : ''}`} id="publish-dropdown-content">
                                <ul><li><Link to="/publish">publish</Link></li></ul>
                                {/* <ul><li><Link to="/incomingForms">Incoming List</Link></li></ul> */}
                            </div>
                        </div>

                        {/* <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('incoming')}>
                            <FaUserGroup className='text-xl'/> Out./Inc.History <span className="dropdown-symbol">{dropdownStates.incoming ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.incoming ? 'show' : ''}`} id="incoming-dropdown-content">
                                <ul><li><Link to="/OutgoingList">Outgoing List</Link></li></ul>
                                <ul><li><Link to="/IncomingList">Incoming List</Link></li></ul>
                            </div>
                        </div> */}



                        <ul><li><Link onClick={handleLogout} className='flex gap-2'><IoLogOutSharp className='text-2xl' />Logout</Link></li></ul>

                    </div>
                )}

                {role === 'Forms Admin' && (
                    <div className="formadmin-link">
                        <ul><li><Link to="/Home" className='flex items-center gap-2'><IoMdHome className='text-2xl' />Home</Link></li></ul>


                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('Forms')}>
                                <FaUserGroup className='text-xl' />Forms <span className="dropdown-symbol">{dropdownStates.Forms ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.VoterL ? 'show' : ''}`} id="caste-dropdown-content">
                                <ul><li><a href="/outgoingForms">Outgoing Forms</a></li></ul>
                                <ul><li><a href="/incomingForms">Incoming Forms</a></li></ul>
                                {/* <ul><li><a href="/updatedIncomingForms">Updated Incoming Forms</a></li></ul> */}
                            </div>
                        </div>

                        <ul><li><Link onClick={handleLogout} className='flex gap-2'><IoLogOutSharp className='text-2xl' />Logout</Link></li></ul>

                    </div>
                )}

                {role === 'Admin' && (
                    <div className="admin-link">
                        <ul><li><Link to="/Home" className='flex items-center gap-2'><IoMdHome className='text-2xl' />Home</Link></li></ul>


                        {permission !== '0' &&
                            <div className="dropdown">
                                <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('SubAdmin')}>
                                    <FaUserGroup className='text-xl' />Sub Admin<span className="dropdown-symbol">{dropdownStates.SubAdmin ? '-' : '+'}</span>
                                </button>
                                <div className={`dropdown-content ${dropdownStates.SubAdmin ? 'show' : ''}`} id="SubAdmin-dropdown-content">
                                    {/* <ul><li><Link to="/userForm">Sub Admin</Link></li></ul> */}
                                    <ul><li><Link to={{ pathname: "/userForm", search: "?content=Sub Admin" }}>  <FaUserGroup className='text-xl' />Sub Admin</Link></li></ul>
                                </div>
                            </div>
                        }


                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('pariseeman')}>
                                <FaLocationDot className='text-xl' />Pariseeman<span className="dropdown-symbol">{dropdownStates.pariseeman ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.pariseeman ? 'show' : ''}`} id="pariseeman-dropdown-content">
                                <ul><li><Link to="/Tehsil">Tehsil</Link></li></ul>
                                <ul><li><Link to="/Council">Council</Link></li></ul>
                                <ul><li><Link to="/VidhanSabha">VidhanSabha</Link></li></ul>
                                <ul><li><Link to="/WardBlock">Ward/Block</Link></li></ul>
                                <ul><li><Link to="/chakblock">chak/block</Link></li></ul>
                                <ul><li><Link to="/Areavill">Area/ vill</Link></li></ul>
                            </div>
                        </div>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('Caste')}>
                                <FaUserGroup className='text-xl' /> Caste <span className="dropdown-symbol">{dropdownStates.Caste ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.Caste ? 'show' : ''}`} id="caste-dropdown-content">
                                <ul><li><Link to="/CasteManagement" >Caste Management</Link></li></ul>
                            </div>
                        </div>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('PollingStation')}><FaUserGroup className='text-xl' /> Polling Station <span className="dropdown-symbol">{dropdownStates.PollingStation ? '-' : '+'}</span></button>
                            <div className={`dropdown-content ${dropdownStates.PollingStation ? 'show' : ''}`} id="pollingstation-dropdown-content">
                                <ul><li><Link to="/PollingStationList">Polling Station List</Link></li></ul>
                                <ul><li><Link to="/PollingStationAllotment">Polling Station Allotment</Link></li></ul>
                            </div>
                        </div>


                        {permission !== '0' &&

                            <div className="dropdown">
                                <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('Staff')}>
                                    <FaUserGroup className='text-xl' /> Communication<span className="dropdown-symbol">{dropdownStates.Staff ? '-' : '+'}</span>
                                </button>

                                <div className={`dropdown-content ${dropdownStates.Staff ? 'show' : ''}`} id="Staff-dropdown-content">
                                    <ul><li><Link to="/QcForm">SMS</Link></li></ul>
                                    <ul><li><Link to="/whatsapp">Whatsapp</Link></li></ul>
                                    <ul><li><Link to="/DispatchLetter">Dispatch letter </Link></li></ul>
                                   
                                </div>
                            </div>
                        }

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('Reporters')}><FaUserGroup className='text-xl' />Reporters <span className="dropdown-symbol">{dropdownStates.Reporters ? '-' : '+'}</span></button>
                            <div className={`dropdown-content ${dropdownStates.Reporters ? 'show' : ''}`} id="reporters-dropdown-content">
                                <ul><li><Link to="/MISDISTRICT">MIS DISTRICT</Link></li></ul>
                                <ul><li><Link to="/MISWardWise">MIS Ward wise</Link></li></ul>
                                <ul><li><Link to="/MISVidhansabhawise">MIS Vidhansabha wise</Link></li></ul>
                                <ul><li><Link to="/MISPollingStationwise">MIS Polling Station wise</Link></li></ul>
                                <ul><li><Link to="/PollingStationVoterwise">Polling Station Voter wise</Link></li></ul>
                            </div>
                        </div>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('voterList')}><FaUserGroup className='text-xl' /> Voter Reports <span className="dropdown-symbol">{dropdownStates.voterList ? '-' : '+'}</span></button>
                            <div className={`dropdown-content ${dropdownStates.voterList ? 'show' : ''}`} id="voterlist-dropdown-content">
                                <ul><li><Link to="/VoterList">Voter List</Link></li></ul>
                                <ul><li><Link to="/MotherRoleVoterList">Mother Role Voter List</Link></li></ul>
                                <ul><li><Link to="/DeleteVoter">Delete Voter</Link></li></ul>
                            </div>
                        </div>

                        <ul><li><Link onClick={handleLogout} className='flex gap-2'><IoLogOutSharp className='text-2xl' />Logout</Link></li></ul>

                    </div>
                )}

                {role === 'Sub Admin' && (
                    <div className="subadmin-link">
                        <ul><li><Link to="/Home" className='flex items-center gap-2'><IoMdHome className='text-2xl' />Home</Link></li></ul>

                        {permission !== '0' &&
                            <div className="dropdown">
                                <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('Staff')}>
                                    <FaUserGroup className='text-xl' /> Staff<span className="dropdown-symbol">{dropdownStates.Staff ? '-' : '+'}</span>
                                </button>

                                <div className={`dropdown-content ${dropdownStates.Staff ? 'show' : ''}`} id="Staff-dropdown-content">
                                    <ul><li><Link to={{ pathname: "/userForm", search: "?content=Feeding Staff" }}>Feeding Staff</Link></li></ul>
                                    <ul><li><Link to={{ pathname: "/userForm", search: "?content=QC Staff" }}>Quality Staff</Link></li></ul>
                                   
                                </div>
                            </div>
                        }
                        <br />
                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2
                            " onClick={() => toggleDropdown('Form')}>
                                <FaUserGroup className='text-xl' /> Form<span className="dropdown-symbol">{dropdownStates.Form ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.Form ? 'show' : ''}`} id="form-dropdown-content">
                                <ul><li><Link to="/feedingstaffcount">Feeding Count</Link></li></ul>
                                <ul><li><Link to="/qcstaffcount">QC Count</Link></li></ul>
                            </div>
                        </div>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('VoterL')}>
                                <FaUserGroup className='text-xl' /> Voter List <span className="dropdown-symbol">{dropdownStates.VoterL ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.VoterL ? 'show' : ''}`} id="caste-dropdown-content">
                                <ul><li><Link to="/VoterList">Voter List</Link></li></ul>
                                <ul><li><Link to="/ReferenceVoterList">Reference Voter List</Link></li></ul>
                            
                            </div>
                        </div>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2
                    " onClick={() => toggleDropdown('Telecaller')}>
                                <FaUserGroup className='text-xl' /> Telecaller<span className="dropdown-symbol">{dropdownStates.Telecaller ? '-' : '+'}</span>
                            </button>

                            <div className={`dropdown-content ${dropdownStates.Telecaller ? 'show' : ''}`} id="Telecaller-dropdown-content">
                                {permission !== '0' &&
                                    <ul><li><Link to="/addtelecallerdata">Add Data</Link></li></ul>
                                }
                                <ul><li><Link to="/employeeDetails">Display Data</Link></li></ul>
                            </div>
                        </div>

                        <ul><li><Link onClick={handleLogout} className='flex gap-2'><IoLogOutSharp className='text-2xl' />Logout</Link></li></ul>

                    </div>
                )}

                {role === 'Feeding Staff' && (
                    <div className="feedingStaff-link">
                        <ul><li><Link to="/Home" className='flex items-center gap-2'><IoMdHome className='text-2xl' />Home</Link></li></ul>

                        <div className="dropdown">
                            <button className="dropbtn flex items-center gap-2" onClick={() => toggleDropdown('Form')}>
                                <FaUserGroup className='text-xl' />Form<span className="dropdown-symbol">{dropdownStates.Form ? '-' : '+'}</span>
                            </button>
                            <div className={`dropdown-content ${dropdownStates.Form ? 'show' : ''}`} id="form-dropdown-content">
                                <ul><li><Link to="/addVotersForm">Add Voter's Form</Link></li></ul>
                                <ul><li><Link to="/SearchChakBlock">Search Chak Block</Link></li></ul>
                            </div>
                        </div>

                        <ul><li><Link onClick={handleLogout} className='flex gap-2'><IoLogOutSharp className='text-2xl' />Logout</Link></li></ul>

                    </div>
                )}


                {role === 'QC Staff' && (
                    <div className="qualitystaff-link">
                        <ul><li><Link to="/Home" className='flex items-center gap-2'><IoMdHome className='text-2xl' />Home</Link></li></ul>
                        <ul><li><Link to="/VoterList" className='flex items-center gap-2'><FaUserGroup className='text-2xl' />Voter List</Link></li></ul>
                        <ul><li><Link to="/SearchChakBlock" className='flex items-center gap-2'><FaUserGroup className='text-2xl' />Search Chak Block</Link></li></ul>
                        <ul><li><Link onClick={handleLogout} className='flex gap-2'><IoLogOutSharp className='text-2xl' />Logout</Link></li></ul>

                    </div>
                )}
            </div>

        </div>
    );
}

export default SideNavBar;
