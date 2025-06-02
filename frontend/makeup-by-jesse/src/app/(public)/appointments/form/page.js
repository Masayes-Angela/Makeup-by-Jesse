'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaChevronDown } from 'react-icons/fa';
import styles from './form.module.css';
import { FaChevronLeft } from 'react-icons/fa';

export default function AppointmentFormPage() {
  const [formData, setFormData] = useState({
    eventType: '',
    paymentMode: '',
    addressLine: '',
    barangay: '',
    city: '',
    province: '',
    addressNote: '',
    message: '',
  });

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const rawDate = localStorage.getItem('selectedDate');
    const time = localStorage.getItem('selectedTime');

    if (rawDate) {
      const formatted = new Date(rawDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      setSelectedDate(formatted);
    }

    if (time) {
      setSelectedTime(time);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectPayment = (value) => {
    setFormData(prev => ({ ...prev, paymentMode: value }));
    setDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Appointment submitted!');
  };

  return (
    <section className={styles.wrapper}>
    <div className={styles.fullTopRowWrapper}>
    <div className={styles.topRow}>
        <button className={styles.goBackBtn} onClick={() => router.push('/appointments')}>
            <FaChevronLeft className={styles.iconLeft} style={{ marginRight: '0.5rem' }} />
            Go Back
        </button>

        <div className={styles.headingGroup}>
            <h2 className={styles.heading}>Appointment Form</h2>
            <p className={styles.subheading}>Fill in Your Details to Schedule an Appointment</p>
        </div>
    </div>
    </div>

      <div className={styles.formWrapper}>
        <div className={styles.datetimeDisplay}>
          <span className={styles.dateBox}>{selectedDate || 'No Date Selected'}</span>
          <span className={styles.timeText}>{selectedTime || 'No Time Selected'}</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.row}>
            <input
              type="text"
              name="eventType"
              placeholder="Event Type"
              value={formData.eventType}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="off"
            />

            {/* Custom Dropdown */}
            <div className={styles.dropdown}>
              <div
                className={styles.selectBox}
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                <span className={!formData.paymentMode ? styles.placeholder : ''}>
                  {formData.paymentMode || 'Mode of Payment'}
                </span>
                <FaChevronDown className={styles.icon} />
              </div>

              {dropdownOpen && (
                <ul className={styles.options}>
                  {['Cash', 'Not Cash'].map((opt) => (
                    <li key={opt} onClick={() => handleSelectPayment(opt)}>
                      {opt}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          <input
            type="text"
            name="addressLine"
            placeholder="Address Line"
            value={formData.addressLine}
            onChange={handleChange}
            className={styles.input}
            required
            autoComplete="address-line1"
          />

          <div className={styles.row}>
            <input
              type="text"
              name="barangay"
              placeholder="Barangay"
              value={formData.barangay}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="address-level3"
            />
            <input
              type="text"
              name="city"
              placeholder="City"
              value={formData.city}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="address-level2"
            />
            <input
              type="text"
              name="province"
              placeholder="Province"
              value={formData.province}
              onChange={handleChange}
              className={styles.input}
              required
              autoComplete="address-level1"
            />
          </div>

          <div className={styles.row}>
            <textarea
              name="addressNote"
              placeholder="Address Note"
              value={formData.addressNote}
              onChange={handleChange}
              className={styles.textarea}
            />
            <textarea
              name="message"
              placeholder="Additional Message"
              value={formData.message}
              onChange={handleChange}
              className={styles.textarea}
            />
          </div>

          <div className={styles.centerBtn}>
            <button type="submit" className={styles.submitBtn}>
              Submit
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}