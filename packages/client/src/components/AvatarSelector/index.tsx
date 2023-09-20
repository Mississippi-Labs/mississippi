import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import './styles.scss';

const Avatars = ['elephant', 'hippo', 'panda', 'penguin', 'rabbit', 'giraffe', 'monkey', 'parrot', 'pig', 'snake'];

interface IProps {
  onChange: (avatar: string | null) => void;
}

const AvatarSelector = (props: IProps) => {

  const [avatarsVisible, setAvatarsVisible] = useState(false);
  const [avatar, setAvatar] = useState<null | string>(null);

  useEffect(() => {
    props.onChange(avatar);
  }, [avatar])

  const toggleAvatars = () => {
    setAvatarsVisible(!avatarsVisible);
  }

  return (
    <div className="mi-c-avatars-wrap">
      {
        avatar ?
          <div className={`avatar-selected avatar-${avatar}`} onClick={toggleAvatars} />
          :
          <Button onClick={toggleAvatars}>Choose avatar</Button>
      }
      {
        avatarsVisible && (
          <ul className="avatars">
            {
              Avatars.map((avatar) => {
                return (
                  <li
                    className={`avatar-item avatar-${avatar}`}
                    onClick={() => {
                      setAvatar(avatar);
                      setAvatarsVisible(false);
                    }}
                  />
                )
              })
            }
          </ul>
        )
      }

    </div>
  );
};

export default AvatarSelector;