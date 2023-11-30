import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { MainContext } from './context/useMainContext';

type MessageType = {
  created_at: string;
  message_context: string;
  receiver_id: number;
  sender_id: number;
  profile_picture: string;
  sender_username: string;
};

export default function Message() {
  const [message, setMessage] = useState<MessageType[]>([]);
  const userId = Number(localStorage.getItem('ordering-token'));

  const { setRecepientIDNumber, showMessage, setShowMessage } =
    useContext(MainContext);

  const handleShowMessage = (id: number) => {
    setShowMessage(!showMessage);
    setRecepientIDNumber(id);
    // console.log(showMessage);
    console.log(id, 'id');
  };

  return (
    <div className="flex flex-col justify-between relative">
      <div className="h-[20rem] block overflow-x-auto bg-white">
        <h1>You have {message.length} message/s</h1>

        {message.length > 0 ? (
          message.map((mes, index) => {
            return (
              <div
                className="border-2 p-2 mt-[1rem] rounded-sm bg-gray-200"
                key={index}
              >
                <div className="flex items-center gap-4">
                  <img
                    className="w-[5rem] h-[5rem] rounded-full object-cover"
                    src={mes.profile_picture}
                  />
                  <div className="flex flex-col w-full">
                    <span className="flex justify-between w-full">
                      <h1
                        onClick={() => handleShowMessage(mes.sender_id)}
                        className="font-bold cursor-pointer"
                      >
                        {mes.sender_username}
                      </h1>
                      <p className="text-xs">
                        {/* {moment(mes.created_at).format('LLL')} */}
                        date date
                      </p>
                    </span>

                    <p>{mes.message_context}</p>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p>No notifications</p>
        )}
      </div>
    </div>
  );
}
