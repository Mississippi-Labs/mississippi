import React from 'react';
import './styles.scss';

export interface IEquipment {
  type: string;
  name?: string | undefined;
}

const Equipment = (props: IEquipment) => {

  const { name, type } = props;

  if (!name) {
    return null;
  }

  return (
    <div className={'mi-equipment'} style={{
      backgroundImage: `url("/assets/img/hero/${type}/${name}.png")`,
    }}>
      <div className="equipment-info">
        <div className="equipment-info-content">
          <ul className="loot-list">
            <li className="loot-item"></li>
            <li className="loot-item"></li>
            <li className="loot-item"></li>
          </ul>

          <p className="equipment-desc">This piece of equipment is synthesized from 3 pieces of loot</p>
        </div>
      </div>
    </div>
  );
};

export default Equipment;