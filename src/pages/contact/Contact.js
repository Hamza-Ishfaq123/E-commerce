import React from 'react'
import styles from './Contact.module.scss'
import Card from '../../components/card/Card';
import { FaEnvelope, FaPhoneAlt, FaTwitter } from 'react-icons/fa';
import { GoLocation } from 'react-icons/go'
const Contact = () => {


  const sendEmail = () => {

  };
  return (
    <section>
      <div className={`container ${styles.contact}`}>
        <h2>Contact Us</h2>
        <div className={styles.section}>
          <form onSubmit={sendEmail}>
            <Card cardClass={styles.card}>
              <label>Name :</label>
              <input type="text" name='user_name' placeholder='Name' required />
              <label>Email :</label>
              <input type="email" name='user_email' placeholder='Your active email' required />
              <label>Subject :</label>
              <input type="text" name='subject' placeholder='Subject' required />
              <label >Message</label>
              <textArea name="message" cols="" rows=""></textArea>
              <button className='--btn --btn-primary'>Send Message</button>
            </Card>

          </form>

          <div className={styles.details}>
            <Card cardClass={styles.card2}>
              <h3>Our contact information</h3>
              <p>Contact us by following sources</p>
              <div className={styles.icons}>
                <span>
                  <FaPhoneAlt />
                  <p>03437122367</p>
                </span>
                <span>
                  <FaEnvelope />
                  <p>alvihamza32@gmail.com</p>
                </span>
                <span>
                  <GoLocation />
                  <p>Multan,Pakistan</p>
                </span>
                <span>
                  <FaTwitter />
                  <p>HamzaIshfaq007</p>
                </span>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Contact
