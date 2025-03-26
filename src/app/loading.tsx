'use client';

import { useEffect, useState } from 'react';
import styles from './loading.module.css';

const Loading = () => {
  const [showPreloader, setShowPreloader] = useState(true);

  useEffect(() => {
    // Check if this is the first load after login
    const hasLoadedBefore = localStorage.getItem('hasLoadedBefore');
    if (hasLoadedBefore) {
      setShowPreloader(false);
      return;
    }

    // Set flag to indicate we've loaded before
    localStorage.setItem('hasLoadedBefore', 'true');

    // Hide preloader after animation
    const timer = setTimeout(() => {
      setShowPreloader(false);
    }, 3000); // Match this with your animation duration

    return () => clearTimeout(timer);
  }, []);

  if (!showPreloader) {
    return null;
  }

  return (
    <div className={styles.animatedLogo}>
      <svg width="131" height="50" viewBox="-14 -14 131 50" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.411 17V4.981H26.69V6.63H20.213V10.234H25.942V11.866H20.213V15.351H26.69V17H18.411ZM28.7684 17V4.981H30.5194V17H28.7684ZM36.8854 17.102C35.9447 17.102 35.157 16.9093 34.5224 16.524C33.8877 16.1387 33.406 15.606 33.0774 14.926C32.76 14.2347 32.6014 13.4413 32.6014 12.546C32.6014 11.6393 32.7657 10.8403 33.0944 10.149C33.4344 9.45767 33.9217 8.91367 34.5564 8.517C35.2024 8.12033 35.9787 7.922 36.8854 7.922C37.5767 7.922 38.1774 8.05233 38.6874 8.313C39.1974 8.56233 39.6167 8.90233 39.9454 9.333C40.2854 9.76367 40.5347 10.2453 40.6934 10.778C40.852 11.2993 40.92 11.8433 40.8974 12.41C40.8974 12.5347 40.8917 12.6537 40.8804 12.767C40.869 12.8803 40.8577 12.9993 40.8464 13.124H34.3694C34.4034 13.5773 34.5167 13.991 34.7094 14.365C34.9134 14.739 35.1967 15.0393 35.5594 15.266C35.922 15.4813 36.3697 15.589 36.9024 15.589C37.197 15.589 37.4804 15.555 37.7524 15.487C38.0357 15.4077 38.285 15.2887 38.5004 15.13C38.727 14.96 38.8857 14.7447 38.9764 14.484H40.7444C40.597 15.0847 40.3307 15.5833 39.9454 15.98C39.5714 16.3653 39.1124 16.6487 38.5684 16.83C38.0357 17.0113 37.4747 17.102 36.8854 17.102ZM34.4034 11.73H39.1634C39.152 11.288 39.05 10.897 38.8574 10.557C38.6647 10.2057 38.3984 9.93367 38.0584 9.741C37.7184 9.537 37.3104 9.435 36.8344 9.435C36.313 9.435 35.8767 9.54267 35.5254 9.758C35.1854 9.97333 34.919 10.2567 34.7264 10.608C34.545 10.948 34.4374 11.322 34.4034 11.73ZM45.3211 17L41.9721 8.041H43.9271L46.5111 15.419L49.0781 8.041H51.0501L47.7011 17H45.3211ZM55.2995 17.102C54.8915 17.102 54.4949 17.051 54.1095 16.949C53.7355 16.8357 53.4012 16.6713 53.1065 16.456C52.8119 16.2293 52.5739 15.9517 52.3925 15.623C52.2225 15.283 52.1375 14.8863 52.1375 14.433C52.1375 13.889 52.2395 13.4413 52.4435 13.09C52.6589 12.7273 52.9422 12.4497 53.2935 12.257C53.6449 12.053 54.0472 11.9113 54.5005 11.832C54.9652 11.7413 55.4469 11.696 55.9455 11.696H58.1385C58.1385 11.254 58.0705 10.8687 57.9345 10.54C57.7985 10.2 57.5832 9.93933 57.2885 9.758C57.0052 9.56533 56.6255 9.469 56.1495 9.469C55.8662 9.469 55.5942 9.503 55.3335 9.571C55.0842 9.62767 54.8689 9.724 54.6875 9.86C54.5062 9.996 54.3815 10.1773 54.3135 10.404H52.4775C52.5455 9.97333 52.6985 9.605 52.9365 9.299C53.1745 8.98167 53.4692 8.721 53.8205 8.517C54.1719 8.313 54.5459 8.16567 54.9425 8.075C55.3505 7.973 55.7642 7.922 56.1835 7.922C57.4755 7.922 58.4049 8.30167 58.9715 9.061C59.5495 9.809 59.8385 10.8403 59.8385 12.155V17H58.3255L58.2575 15.861C57.9969 16.2123 57.6852 16.4787 57.3225 16.66C56.9712 16.8413 56.6199 16.9603 56.2685 17.017C55.9172 17.0737 55.5942 17.102 55.2995 17.102ZM55.5715 15.623C56.0815 15.623 56.5292 15.538 56.9145 15.368C57.2999 15.1867 57.6002 14.9317 57.8155 14.603C58.0309 14.263 58.1385 13.8663 58.1385 13.413V13.039H56.5405C56.2119 13.039 55.8889 13.0503 55.5715 13.073C55.2655 13.0843 54.9822 13.1297 54.7215 13.209C54.4722 13.277 54.2682 13.396 54.1095 13.566C53.9622 13.736 53.8885 13.9797 53.8885 14.297C53.8885 14.603 53.9679 14.8523 54.1265 15.045C54.2852 15.2377 54.4949 15.385 54.7555 15.487C55.0162 15.5777 55.2882 15.623 55.5715 15.623ZM65.6626 17.102C64.6993 17.102 64.008 16.8413 63.5886 16.32C63.1806 15.7873 62.9766 15.045 62.9766 14.093V9.605H61.5486V8.041H62.9766V5.44H64.7276V8.041H67.4646V9.605H64.7276V13.804C64.7276 14.1213 64.756 14.4103 64.8126 14.671C64.8806 14.9317 65.0053 15.1357 65.1866 15.283C65.368 15.4303 65.6286 15.5097 65.9686 15.521C66.2293 15.521 66.456 15.4757 66.6486 15.385C66.8526 15.2943 67.017 15.1923 67.1416 15.079L67.8216 16.388C67.6063 16.558 67.3796 16.6997 67.1416 16.813C66.915 16.915 66.677 16.9887 66.4276 17.034C66.1783 17.0793 65.9233 17.102 65.6626 17.102ZM73.2833 17.102C72.3426 17.102 71.5549 16.9093 70.9203 16.524C70.2856 16.1387 69.8039 15.606 69.4753 14.926C69.1579 14.2347 68.9993 13.4413 68.9993 12.546C68.9993 11.6393 69.1636 10.8403 69.4923 10.149C69.8323 9.45767 70.3196 8.91367 70.9543 8.517C71.6003 8.12033 72.3766 7.922 73.2833 7.922C73.9746 7.922 74.5753 8.05233 75.0853 8.313C75.5953 8.56233 76.0146 8.90233 76.3433 9.333C76.6833 9.76367 76.9326 10.2453 77.0913 10.778C77.2499 11.2993 77.3179 11.8433 77.2953 12.41C77.2953 12.5347 77.2896 12.6537 77.2783 12.767C77.2669 12.8803 77.2556 12.9993 77.2443 13.124H70.7673C70.8013 13.5773 70.9146 13.991 71.1073 14.365C71.3113 14.739 71.5946 15.0393 71.9573 15.266C72.3199 15.4813 72.7676 15.589 73.3003 15.589C73.5949 15.589 73.8783 15.555 74.1503 15.487C74.4336 15.4077 74.6829 15.2887 74.8983 15.13C75.1249 14.96 75.2836 14.7447 75.3743 14.484H77.1423C76.9949 15.0847 76.7286 15.5833 76.3433 15.98C75.9693 16.3653 75.5103 16.6487 74.9663 16.83C74.4336 17.0113 73.8726 17.102 73.2833 17.102ZM70.8013 11.73H75.5613C75.5499 11.288 75.4479 10.897 75.2553 10.557C75.0626 10.2057 74.7963 9.93367 74.4563 9.741C74.1163 9.537 73.7083 9.435 73.2323 9.435C72.7109 9.435 72.2746 9.54267 71.9233 9.758C71.5833 9.97333 71.3169 10.2567 71.1243 10.608C70.9429 10.948 70.8353 11.322 70.8013 11.73ZM79.696 17V4.981H81.498V10.268H87.516V4.981H89.318V17H87.516V11.917H81.498V17H79.696ZM92.4022 17V4.981H97.0262C97.6722 4.981 98.2615 5.049 98.7942 5.185C99.3268 5.30967 99.7915 5.51933 100.188 5.814C100.585 6.09733 100.891 6.48267 101.106 6.97C101.322 7.45733 101.429 8.058 101.429 8.772C101.429 9.418 101.316 9.97333 101.089 10.438C100.863 10.9027 100.551 11.288 100.154 11.594C99.7575 11.9 99.3098 12.1323 98.8112 12.291L101.378 17H99.3892L97.0092 12.58H94.2042V17H92.4022ZM94.2042 10.965H96.6522C97.0602 10.965 97.4398 10.9367 97.7912 10.88C98.1538 10.812 98.4712 10.6987 98.7432 10.54C99.0152 10.37 99.2248 10.1433 99.3722 9.86C99.5308 9.56533 99.6102 9.19133 99.6102 8.738C99.6215 8.21667 99.5195 7.803 99.3042 7.497C99.1002 7.17967 98.7942 6.95867 98.3862 6.834C97.9782 6.698 97.4852 6.63 96.9072 6.63H94.2042V10.965Z" />
        <path d="M0 1C0 0.447715 0.447715 0 1 0H9.58579C10.4767 0 10.9229 1.07714 10.2929 1.70711L6 6L1.70711 10.2929C1.07714 10.9229 0 10.4767 0 9.58579V1Z" fill="#111111" fillOpacity="0.92"/>
        <path d="M0 21C0 21.5523 0.447715 22 1 22H9.58579C10.4767 22 10.9229 20.9229 10.2929 20.2929L6 16L1.70711 11.7071C1.07714 11.0771 0 11.5233 0 12.4142V21Z" fill="#111111" fillOpacity="0.92"/>
      </svg>
    </div>
  );
};

export default Loading;