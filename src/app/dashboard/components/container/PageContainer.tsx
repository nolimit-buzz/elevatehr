// import { Helmet } from 'react-helmet';
import { Helmet, HelmetProvider } from 'react-helmet-async';


type Props = {
  description?: string;
  customStyle?: React.CSSProperties;
  children: JSX.Element | JSX.Element[];
  title?: string;
};

const PageContainer = ({ title, description, children, customStyle }: Props) => (
  <HelmetProvider>
    <div style={{ maxWidth: '1440px', margin: 'auto', padding: '20px', width: '100%', ...customStyle }}>
    <div style={{ margin: '20px !important', position: 'relative' }}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
      </Helmet>
      {children}
    </div>
    </div>
   
  </HelmetProvider>
);

export default PageContainer;
