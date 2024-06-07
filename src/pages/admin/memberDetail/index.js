import {ArrowBack} from "@mui/icons-material";
import {Avatar, Box, Button, IconButton, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import MembersAPI from "../../../api/firebase/MembersAPI";
import NewMemberForm from "../../../components/app/forms/new-member";

const MemberDetail = () => {
  const {memberId} = useParams();
  const navigate = useNavigate();
  const [memberData, setMemberData] = useState(null);
  const membersAPI = new MembersAPI();
  //console.log("memberId:", memberId);

  useEffect(() => {
    if (memberData === null) {
      membersAPI
        .getMemberById(memberId)
        .then((res) => {
          // console.log("member data: ", res.data);
          setMemberData(res.data);
        })
        .catch((err) => {
          console.log("err:", err);
          setMemberData(null);
        });
    }
  }, [memberId]);

  return (
    <div className="container">
      <IconButton sx={{ml: "-2rem"}} onClick={() => navigate(-1)}>
        <ArrowBack sx={{fontSize: 32}} />
      </IconButton>
      <Box component="div">
        <Typography
          sx={{
            marginBottom: "1rem",
          }}
          variant="h5"
          component="h5"
        >
          Member Detail
        </Typography>
        <Typography
          sx={{
            marginBottom: "2rem",
          }}
          variant="h6"
          component="h6"
        >
          ID: {memberId}
        </Typography>
      </Box>
      <div className="row justify-content-around">
        <div className="col-12 col-md-8">
          <Avatar
            alt={memberData ? memberData.name : ""}
            src={memberData ? memberData.latest_photo : ""}
            sx={{width: 120, height: 120}}
            className="mx-auto mb-3 mt-3"
          />
          <NewMemberForm memberData={memberData} />
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{mt: "1rem", mb: "1rem"}}
            fullWidth
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;
