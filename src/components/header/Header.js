import { useState } from 'react'
import styles from './Header.module.scss'
import { NavLink } from 'react-router-dom'
import { FaShoppingCart, FaTimes, FaUserCircle } from 'react-icons/fa'
import { HiOutlineMenuAlt3 } from 'react-icons/hi'
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_USER, REMOVE_ACTIVE_USER } from '../../redux/slice/authSlice'
import ShowOnLogin from '../hiddenLinks/hiddenLinks'
import { ShowOnLogout } from '../hiddenLinks/hiddenLinks'
import AdminOnlyRoute, { AdminOnlyLink } from '../adminOnlyRoute/AdminOnlyRoute'
import { Link } from 'react-router-dom'
import { CALCULATE_TOTAL_QUANTITY, selectCartTotalQuantity } from '../../redux/slice/cartSlice'


const logo = (
  < div className={styles.logo} >
    <NavLink to="/">
      <h2>e<span>Shop</span>.</h2>
    </NavLink>
  </div >)



const active = (({ isActive }) => (isActive ? `${styles.active}` : ''));

const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [scrollPage, setScrollPage] = useState(false)
  const cartTotalQuantity = useSelector(selectCartTotalQuantity);
  const navigate = useNavigate();
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(CALCULATE_TOTAL_QUANTITY());
  }, [])


  const fixedNavbar = () => {
    if (window.scrollY > 50) {
      setScrollPage(true)
    } else {
      setScrollPage(false);
    }
  }
  window.addEventListener("scroll", fixedNavbar);

  useEffect(() => {
    //monitor the currently signed in user
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // const uid = user.uid;
        // console.log(user);
        if (user.displayName == null) {
          const u1 = user.email.substring(0, user.email.indexOf('@'));
          const uName = u1.charAt(0).toUpperCase() + u1.slice(1);
          console.log(uName);
          setDisplayName(uName);
        } else {
          setDisplayName(user.displayName);
        }

        //setting active user in store
        dispatch(SET_ACTIVE_USER({
          email: user.email,
          userName: user.displayName ? user.displayName : displayName,
          userId: user.uid,
        }));
      } else {
        setDisplayName('');
        dispatch(REMOVE_ACTIVE_USER());
      }
    });

  }, [dispatch, displayName]);
  //on mobile show r hide the menu
  const toggleMenu = () => {
    setShowMenu(!showMenu);
  }
  // this function hide the menu anytime it triggered
  const hideMenu = () => {
    setShowMenu(false);
  }

  const logoutUser = () => {
    signOut(auth).then(() => {
      // Sign-out successful.
      toast.success("logout successful");

      navigate('/login');
    }).catch((error) => {
      toast.error(error.message);
    });
  }
  const cart = (
    <span className={styles.cart}>
      <NavLink to={'/cart'}>
        Cart
        <FaShoppingCart size={20} />
        <p>{cartTotalQuantity}</p>
      </NavLink>
    </span>
  )

  return (
    <header className={scrollPage ? `${styles.fixed}` : null}>
      <div className={styles.header}>
        {logo}

        <nav className={showMenu ? `${styles['show-nav']}` : `${styles["hide-nav"]}`}>
          <div className={showMenu ? `${styles["nav-wrapper"]} ${styles["show-nav-wrapper"]}` : `${styles["nav-wrapper"]}`} onClick={() => hideMenu()}>
          </div>
          <ul onClick={() => hideMenu()}>

            <li className={styles["logo-mobile"]}>
              {logo}
              <FaTimes size={22} color="#fff" onClick={() => hideMenu}
              />
            </li>
            <li>
              <AdminOnlyLink>
                <Link to="/admin/home">
                  <button className='--btn --btn-primary'>Admin</button>
                </Link>
              </AdminOnlyLink>
            </li>
            <li>
              <NavLink to={"/"} className={active}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to={"/contact"} className={active}>
                Contact Us
              </NavLink>
            </li>
          </ul>

          <div className={styles["header-right"]} onClick={() => hideMenu()}>
            <span className={styles.links}>
              <ShowOnLogout>
                <NavLink
                  to={'/login'}
                  className={active}>
                  Login
                </NavLink>
              </ShowOnLogout>

              <ShowOnLogin >
                <a href='#home'>
                  <FaUserCircle size="16" />
                  Hi, {displayName}
                </a>
              </ShowOnLogin>

              <ShowOnLogin >
                <NavLink to={'/order-history'}
                  className={active}>
                  Order
                </NavLink>
              </ShowOnLogin>
              <ShowOnLogin>
                <NavLink to={'/logout'}
                  onClick={logoutUser}>
                  logout
                </NavLink>
              </ShowOnLogin>
            </span>
            {cart}
          </div>

        </nav>

        <div className={styles["menu-icon"]}>
          {cart}
          <HiOutlineMenuAlt3 size={20} onClick={() => toggleMenu()} />
        </div>
      </div >
    </header >
  )
}

export default Header
