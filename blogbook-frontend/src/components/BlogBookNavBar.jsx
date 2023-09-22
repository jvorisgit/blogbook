import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import "bootstrap/dist/css/bootstrap.css";

function BlogBookNavBar() {
  return (
    <>
      <Navbar fluid bg="dark" data-bs-theme="dark">
        <Container>
          <Nav className="justify-content-end" style={{ width: "100%" }}>
            <Nav.Link href="/activity">Activity</Nav.Link>
            <Nav.Link href="/post">New Post</Nav.Link>
            <Nav.Link href="/register">Register</Nav.Link>
            <Nav.Link href="/login">Login</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default BlogBookNavBar;