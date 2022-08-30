import { FC, PropsWithChildren } from 'react';
import { useCustomRouter } from '../../customRouter';

const BOTTOM_BAR_HEIGHT = 60;

export const Layout: FC<PropsWithChildren & BottomNavBarProps> = ({
  children,
  bottomBarActions,
}) => {
  return (
    <div
      className='flex flex-column align-center'
      style={{
        position: 'relative',
        height: '100vh',
        paddingTop: 30,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: 400,
          padding: '0 1em',
          paddingBottom: BOTTOM_BAR_HEIGHT + 5,
          width: '100%',
        }}
        className='flex flex-column overflow-hidden'
      >
        {children}
      </div>
      <BottomNavBar bottomBarActions={bottomBarActions} />
    </div>
  );
};

type BottomNavBarProps = {
  bottomBarActions?: BottomBarAction[];
};
type BottomBarAction = {
  emoji: string;
  action: () => void;
};

const BottomNavBar = ({ bottomBarActions = [] }: BottomNavBarProps) => {
  const router = useCustomRouter();
  return (
    <div
      className='flex gap0'
      style={{
        borderTop: '1px solid #eee',
        fontSize: '3em',
        justifyContent: 'space-evenly',
        position: 'fixed',
        bottom: 0,
        height: BOTTOM_BAR_HEIGHT,
        backgroundColor: 'white',
        width: '100%',
      }}
    >
      <BottomNavBarTab emoji='🏡' onClick={() => router.goToMain()} />
      <BottomNavBarTab emoji='📷' onClick={() => router.goToScan()} />
      {bottomBarActions.map(({ emoji, action }) => (
        <BottomNavBarTab key={emoji} emoji={emoji} onClick={() => action()} />
      ))}
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
