import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "bootstrap/dist/css/bootstrap.css";
import { useContext } from "react";
import { AuthContext } from "../context/authContext.js";

//blog top navigation bar component using react-bootstrap
function BlogBookNavBar() {

  const { currentUser, logout } = useContext(AuthContext);
  //users who aren't authenticated should see: activity, register, login
  //users who are authenticated should see: activity, new post, Hi <email>, logout
  return (
    <>
      <Navbar bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="justify-content-start" style={{ width: "100%" }}>
            <Nav.Link href="/activity">Activity</Nav.Link>
            {currentUser && <Nav.Link href="/post">New Post</Nav.Link>}
            {currentUser && <Nav.Link href="/Activity/drafts">Drafts</Nav.Link>}
            {!currentUser && <Navbar.Collapse className="justify-content-end">
                              <Nav.Link href="/register">Register</Nav.Link>
                              <Nav.Link href="/login">Login</Nav.Link>
                            </Navbar.Collapse>}
            {currentUser && <Navbar.Collapse className="justify-content-end">
                              <Navbar.Text> 
                                  Hi {currentUser.email} 
                              </Navbar.Text>
                                <Button variant="link" onClick={logout}>Logout</Button>
                            </Navbar.Collapse>}
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default BlogBookNavBar;