import { FC, PropsWithChildren } from 'react';
import { useCustomRouter } from '../../customRouter';

const BOTTOM_BAR_HEIGHT = 60;

export const Layout: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div
      className='flex flex-column align-center'
      style={{ position: 'relative', height: '100vh' }}
    >
      <div
        style={{
          maxWidth: 400,
          paddingBottom: BOTTOM_BAR_HEIGHT,
          overflow: 'scroll',
        }}
      >
        {children}
      </div>
      <BottomNavBar />
    </div>
  );
};

const BottomNavBar = () => {
  const router = useCustomRouter();
  return (
    <div
      className='flex gap0'
      style={{
        borderTop: '1px solid #eee',
        fontSize: '3em',
        justifyContent: 'space-evenly',
        position: 'absolute',
        bottom: 0,
        height: BOTTOM_BAR_HEIGHT,
        backgroundColor: 'white',
        width: '100%',
      }}
    >
      <BottomNavBarTab emoji='🏡' onClick={() => router.goToMain()} />
      <BottomNavBarTab emoji='📷' onClick={() => router.goToScan()} />
    </div>
  );
};

const BottomNavBarTab = ({
  emoji,
  onClick,
}: {
  emoji: string;
  onClick?: () => void;
}) => {
  return (
    <span className='flex-1 text-center pointer' onClick={() => onClick?.()}>
      {emoji}
    </span>
  );
};
