import { useRef, useState } from 'react';
import { Modal } from 'antd';

function useModal(config = { title: '' }) {
  // 控制弹窗显示的状态
  const [visible, setVisible] = useState(false);
  // 弹窗的内容
  const content = useRef(null);

  // 打开弹窗的方法
  function open() {
    setVisible(true);
  }

  // 关闭弹窗的方法
  function close() {
    setVisible(false);
  }

  // 弹窗组件
  function ModalComponent(props) {
    return (
      <Modal
        {...config}
        className="mi-modal"
        visible={visible}
        onCancel={close}
        footer={null}
      >
        {content.current}
      </Modal>
    );
  }

  // 返回弹窗组件和打开方法
  return {
    Modal: ModalComponent,
    open,
    close,
    setContent: (node) => {
      content.current = node;
    },
  };
}

export default useModal;