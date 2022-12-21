import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { loadMyProfile } from "../store/users";
import Loading from "../common/Loading";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import "./MyProfile.css";

function MyProfile() {
  const dispatch = useDispatch();
  const { user, loading } = useSelector((state) => state.entities.users);
  const { currentUser } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(loadMyProfile());
  }, [dispatch]);

  if (loading) return <Loading />;

  return (
    <Container>
      <h3 className="profile-header">My Profile</h3>
      <ul className="profile-body">
        <li>
          <h6>Id</h6> {user?._id}
        </li>
        <li>
          <h6>Name</h6> {user?.name}
        </li>
        <li>
          <h6>Email</h6> {user?.email}
        </li>
        <li>
          <h6>Joined</h6> {moment(user?.createdAt).format("MMM Do YYYY")}
        </li>
        {currentUser && currentUser.isAdmin && (
          <li>
            <h6>Role</h6> Admin
          </li>
        )}
      </ul>
    </Container>
  );
}

export default MyProfile;
