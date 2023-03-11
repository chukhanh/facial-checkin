import { ReactElement, ReactNode, useState } from 'react';
import { Layout } from 'antd';
import { Route, RouteProps } from 'react-router-dom';
import Banner from 'components/Banner';
import SideBar from 'components/SideBar';

type TUserLayoutProps = {
  children: ReactNode;
};

const UserLayout = (props: TUserLayoutProps): ReactElement => {
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const toggleMenu = (): void => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      <Banner toggleMenu={toggleMenu} />
      <Layout>
        <SideBar collapsed={collapsed} />
        <Layout>{props.children}</Layout>
      </Layout>
    </>
  );
};

export default function UserTemplate(props: RouteProps): ReactElement {
  return (
    <Route
      path={props.path}
      {...props.exact}
      render={propsComponent => (
        <UserLayout>
          <props.component {...propsComponent} />
        </UserLayout>
      )}
    />
  );
}
