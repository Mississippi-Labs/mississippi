import duck from "@/assets/img/DarkDuck.svg";
import info from "@/assets/img/battle/info.png";
import attackButton from "@/assets/img/battle/attack-button.png";
import runButton from "@/assets/img/battle/run-button.png";
import rock from "@/assets/img/battle/rock.png";
import scissors from "@/assets/img/battle/scissors.png";
import paper from "@/assets/img/battle/paper.png";
import attack from "@/assets/img/battle/attack.svg";
import tactic from "@/assets/img/battle/tactic.svg";
import "./styles.scss";

export default function Battle() {
  return (
    <div className="mi-battle-wrap">
      <div className="mi-battle">
        <div className="mi-battle-character">
          <div className="mi-battle-info-icon">
            <img
              src={info}
              style={{
                width: "64px",
                height: "64px",
                marginTop: "12px",
                marginLeft: "12px",
              }}
              alt=""
            />
          </div>
          <div className="mi-battle-character-card">
            <div className="mi-battle-character-card-hp">
              <div
                className="hp"
                style={{
                  position: "absolute",
                  borderRadius: "4px",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  background: "#FF6161",
                  width: "60%",
                  height: "22px",
                }}
              ></div>
            </div>
            <img
              src={duck}
              style={{
                transform: "scaleX(-1)",
              }}
              alt=""
            />
          </div>
          <div className="mi-battle-character-card">
            <div className="mi-battle-character-card-hp">
              <div
                className="hp"
                style={{
                  position: "absolute",
                  borderRadius: "4px",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  background: "#FF6161",
                  width: "60%",
                  height: "22px",
                }}
              ></div>
            </div>
            <img src={duck} alt="" />
          </div>
          <div className="mi-battle-character-info">
            <div className="character-info self">
              <div>HP: 30/50</div>
              <div>ATK: 20</div>
            </div>
            <div className="character-info opponent">
              <div>HP: 30/50</div>
              <div>ATK: 20</div>
            </div>
          </div>
        </div>
        <div className="mi-battle-action">
          <div className="action">
            <div className="action-title">Action</div>
            <div style={{ display: "flex" }}>
              <img src={attackButton} alt="" />
              <img src={runButton} alt="" />
            </div>
          </div>
          <div className="action">
            <div
              style={{
                color: "#fff",
                fontSize: "24px",
              }}
            >
              Choose your decision
            </div>
            <div
              style={{
                marginTop: "12px",
                display: "flex",
                justifyContent: "center",
                columnGap: "12px",
              }}
            >
              <img
                src={attack}
                style={{
                  width: "48px",
                  height: "48px",
                }}
                alt=""
              />
              <img
                src={tactic}
                style={{
                  width: "48px",
                  height: "48px",
                }}
                alt=""
              />
            </div>
          </div>
          <div className="action">
            <div className="action-title">Tactic</div>
            <div style={{ display: "flex" }}>
              <img src={rock} alt="" />
              <img src={scissors} alt="" />
              <img src={paper} alt="" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
