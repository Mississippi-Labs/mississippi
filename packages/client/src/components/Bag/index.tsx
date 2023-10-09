import { useState } from "react";
import "./styles.scss";

export default function Bag() {
  const [open, setOpen] = useState(false);

  const [showItemAction, setShowItemAction] = useState<number>();

  return (
    <div className="mi-bag-wrapper">
      <button className="mi-bag-button" onClick={() => setOpen(true)}>
        Bag
      </button>
      {open && (
        <div className="mi-bag-backdrop">
          <div className="mi-bag-modal">
            <div className="mi-bag-modal-character">
              <div className="mi-bag-modal-character-info">
                <div className="mi-bag-character-info-avatar">MIS</div>
                <div className="mi-bag-character-info-detail">
                  <div>Mississippi</div>
                  <div>HP: 150</div>
                  <div>ATK: 50</div>
                  <div>Range: 3</div>
                  <div>Speed: 5</div>
                  <div>Weight: 20</div>
                  <div>Pocket: 30</div>
                </div>
              </div>
              <div className="mi-bag-equip">
                <p>Equipment</p>
                <div className="mi-bag-equip-list">
                  <div className="mi-bag-equip-list-item"></div>
                  <div className="mi-bag-equip-list-item"></div>
                  <div className="mi-bag-equip-list-item"></div>
                  <div className="mi-bag-equip-list-item"></div>
                </div>
              </div>

              <div className="mi-bag-equip">
                <p>Element</p>
                <div
                  className="mi-bag-equip-list"
                  style={{
                    justifyContent: "flex-start",
                  }}
                >
                  <div
                    className="mi-bag-equip-list-item"
                    style={{
                      marginRight: "15%",
                    }}
                  ></div>
                  <div className="mi-bag-equip-list-item"></div>
                </div>
              </div>

              <div className="mi-bag-modal-character-action">
                <button>Again</button>
                <button>lets rock</button>
              </div>

              <div className="mi-bag-modal-character-action">
                <button onClick={() => setOpen(false)}>Close</button>
              </div>
            </div>
            <div className="mi-bag-modal-divider"></div>
            <div className="mi-bag-modal-bag-list">
              {new Array(20).fill(1).map((item, index) => (
                <div
                  className="mi-bag-modal-bag-list-item"
                  onClick={() => setShowItemAction(index)}
                >
                  {showItemAction === index && (
                    <div className="mi-bag-modal-bag-list-item-action">
                      <div className="mi-bag-modal-bag-list-item-action-element-name">
                        <div>item name</div>
                        <div>weight: 999</div>
                      </div>
                      <div className="mi-bag-modal-bag-list-item-action-element-desc">
                        <div>item desc</div>
                      </div>
                      <div className="mi-bag-modal-bag-list-item-action-button">
                        <button>Remove</button>
                        <button>Discard</button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
