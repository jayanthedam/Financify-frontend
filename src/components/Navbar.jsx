import React, { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Menu, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

function CollapsibleExample() {
  const { user, logout } = useAuth();
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    setExpanded(!expanded);
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      expanded={expanded}
      style={{
        backgroundColor: '#ffffff', // Light background
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow
        borderBottom: '2px solid #e7e7e7',
      }}
    >
      <Container>
        {/* Navbar Brand */}
        <Navbar.Brand
          as={Link}
          to="/"
          style={{
            color: '#0d6efd', // Bootstrap primary color for the logo
            fontWeight: 'bold',
            fontSize: '1.5rem',
          }}
        >
          Fi-nancify
        </Navbar.Brand>
        {/* Navbar Toggle */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" onClick={handleToggle}>
          <Menu size={24} />
        </Navbar.Toggle>
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* Right Navigation */}
          <Nav className="ms-auto">
            {user ? (
              <>
                <Nav.Link as={Link} to="/" style={{ color: '#333', fontWeight: 500 }} className="hover-nav">
                  Home
                </Nav.Link>
                <Nav.Link as={Link} to="/dashboard" style={{ color: '#333', fontWeight: 500 }} className="hover-nav">
                  Dashboard
                </Nav.Link>
                <Nav.Link as={Link} to="/form" style={{ color: '#333', fontWeight: 500 }} className="hover-nav">
                  Form
                </Nav.Link>
                <Nav.Link as={Link} to="/investments" style={{ color: '#333', fontWeight: 500 }} className="hover-nav">
                  Investments
                </Nav.Link>
                <Nav.Link onClick={logout} style={{ color: '#ffffff', fontWeight: 500, display: 'flex', alignItems: 'center', background:'red', borderRadius:'10px' }} className="hover-nav">
                  <LogOut size={18} className="mr-2" />
                  Logout
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" style={{ color: '#333', fontWeight: 500 }} className="hover-nav">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register" style={{ color: '#4299e1', fontWeight: 500 }} className="hover-nav">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default CollapsibleExample;


  // import React, { useState } from 'react';
  // import { Link } from 'react-router-dom';
  // import { useAuth } from '../context/AuthContext';
  // import { LogOut, Menu, X, ChartPie } from 'lucide-react';

  // const Navbar = () => {
  //   const { user, logout } = useAuth();
  //   const [isOpen, setIsOpen] = useState(false);

  //   const toggleMenu = () => {
  //     setIsOpen((prev) => !prev);
  //   };

  //   return (
  //     <nav className="bg-white shadow-md">
  //       <div className="container mx-auto px-4">
  //         <div className="flex justify-between items-center h-16">
  //           {/* Logo */}
  //           <Link to="/" className="text-2xl font-bold text-gray-800">
  //             <ChartPie size={25} className="inline-block mr-2 mb-1" />
  //             Fi-nancify
  //           </Link>

  //           {/* Mobile Menu Toggle */}
  //           <button
  //             className="md:hidden text-gray-800 focus:outline-none"
  //             onClick={toggleMenu}
  //             aria-label="Toggle menu"
  //           >
  //             {isOpen ? <X size={24} /> : <Menu size={24} />}
  //           </button>

  //           {/* Desktop & Mobile Menu */}
  //           <div
  //             className={`absolute top-16 left-0 w-full bg-white md:static md:w-auto md:bg-transparent md:flex md:space-x-6 items-center ${
  //               isOpen ? 'block' : 'hidden'
  //             }`}
  //           >
  //             {user ? (
  //               <>
  //                 <Link
  //                   to="/dashboard"
  //                   className="block px-4 py-2 text-gray-800 hover:text-blue-500 md:px-0 md:py-0"
  //                 >
  //                   Dashboard
  //                 </Link>
  //                 <Link
  //                   to="/form"
  //                   className="block px-4 py-2 text-gray-800 hover:text-blue-500 md:px-0 md:py-0"
  //                 >
  //                   Form
  //                 </Link>
  //                 <Link
  //                   to="/investments"
  //                   className="block px-4 py-2 text-gray-800 hover:text-blue-500 md:px-0 md:py-0"
  //                 >
  //                   Investments
  //                 </Link>
  //                 <button
  //                   onClick={logout}
  //                   className="block w-full md:w-auto text-left px-4 py-2 mt-2 md:mt-0 text-white bg-red-500 rounded md:inline-flex items-center hover:bg-red-600 transition-colors"
  //                 >
  //                   <LogOut size={18} className="mr-2" />
  //                   Logout
  //                 </button>
  //               </>
  //             ) : (
  //               <>
  //                 <Link
  //                   to="/login"
  //                   className="block px-4 py-2 text-gray-800 hover:text-blue-500 md:px-0 md:py-0"
  //                 >
  //                   Login
  //                 </Link>
  //                 <Link
  //                   to="/register"
  //                   className="block px-4 py-2 mt-2 text-center text-white bg-blue-500 rounded md:mt-0 md:px-4 md:py-2 md:inline-flex hover:bg-blue-600 transition-colors"
  //                 >
  //                   Register
  //                 </Link>
  //               </>
  //             )}
  //           </div>
  //         </div>
  //       </div>
  //     </nav>
  //   );
  // };

  // export default Navbar;
