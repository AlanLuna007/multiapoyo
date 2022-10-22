import { useEffect, useState } from 'react';
import AuthService from "../services/auth.service";
import { Redirect } from "react-router-dom";
import { Drawer, Badge, Rate, Tag, Pagination, Input } from 'antd';
import { EditOutlined, CheckOutlined } from '@ant-design/icons';
import { TweenOneGroup } from 'rc-tween-one';
const { Search } = Input;
export const Profile = () => {
  const [redirect, setRedirect] = useState("")
  const [people, setPeople] = useState([])
  const [open, setOpen] = useState(false);
  const [person, setPerson] = useState([]);
  const [first_name, setFirst_name] = useState("");
  const [avatar, setAvatar] = useState("");
  const [email, setEmail] = useState("");
  const [last_name, setLast_name] = useState("");
  const [infoUser, setInfoUser] = useState(0);
  const [current, setCurrent] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const [edit, setEdit] = useState(false);
  const [id, setId] = useState(0);
  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (!currentUser) setRedirect("/login");
    handleLogin(1);
  }, [])

  useEffect(() => {
    let step: number = Math.floor(Math.random() * (6 - 1) + 1);
    setInfoUser(step);
  }, [id])

  const handleLogin = (page: number) => {

    AuthService.getPeople(page).then(
      (res) => {
        setPeople(res.data);
        setCurrent(res.page);
      }, error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  }

  const showDrawer = (id: number) => {
    AuthService.getPerson(id).then(
      (res) => {
        setOpen(true);
        setFirst_name(res.data.first_name);
        setAvatar(res.data.avatar);
        setEmail(res.data.email);
        setLast_name(res.data.last_name);
        setId(res.data.id);
      }, error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
    AuthService.postPerson(id).then(
      (res) => {
        let data: any = [];
        
        res.data.forEach((element: any) => {
          data = data.concat(element.name)
        });
        setTags(data);
        
      }, error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  };

  const noEdit = (id: number, email: string) => {
    setEdit(true);
  };

  const onSearch = (id: number, email: string) => {
    AuthService.postEdit(id, email).then(
      (res) => {
        setEdit(false);
        let arr: any = people;
        arr.find((v: any) => v.id === id).email = email;
        setPeople(arr);
        setEmail(res.email);
        
      }, error => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();
      }
    );
  };

  const onClose = () => {
    setOpen(false);
  };

  const handleClose = (removedTag: string) => {
    const newTags = tags.filter(tag => tag !== removedTag);
    setTags(newTags);
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable
        onClose={e => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span key={tag} style={{ display: 'inline-block' }}>
        {tagElem}
      </span>
    );
  };

  const logOut = () => {
    AuthService.logout();
  }

  const tagChild = tags.map(forMap);
  
  return (
    <div>
      <nav className="navbar navbar-expand nav-design-profile">
        <div className='d-flex justify-content-center align-items-center div-pagination'>
      <Pagination total={20} current={current} onChange={(current: number)=>{
        handleLogin(current);
      }}/>
        </div>
      <div className="navbar-nav ml-auto">
      <li className="nav-item">
        <a href="/login" className="nav-link" onClick={logOut}>
          LogOut
        </a>
      </li>
      </div>
  </nav> 
      <Drawer title={first_name} placement="right" onClose={onClose} open={open}>
      <div className="card-person-view">
            <div className='p-3'>
            <img src={avatar} className="card-img-top text-center justify-content-center rounded-circle" alt="..."></img>  
            </div>
            <div className="card-body">
            <h5 className="card-title text-center">{first_name} {last_name}</h5>
            {edit ? <div><Search
                            placeholder="input search text"
                            allowClear
                            defaultValue={email}
                            enterButton={<CheckOutlined />}
                            size="large"
                            onSearch={(value)=>onSearch(id, value)}
                          /></div>
            : <p className="card-text text-center">{email} <EditOutlined className='edit' onClick={()=>noEdit(id, email)}/></p>}
            </div>
            <hr className='text-black-50 border-secondary'/>
            <div className="container text-center">
              <div className="row"><div className="col"><div className='d-flex justify-content-center align-items-center'><h6>skills:</h6></div></div></div>
              <div className="row">
                  <div className='block'>
                    <div style={{ marginBottom: 16 }}>
                    <TweenOneGroup
                      enter={{
                        scale: 0.8,
                        opacity: 0,
                        type: 'from',
                        duration: 100,
                      }}
                      onEnd={e => {
                        if (e.type === 'appear' || e.type === 'enter') {
                          (e.target as any).style = 'display: inline-block';
                        }
                      }}
                      leave={{ opacity: 0, width: 0, scale: 0, duration: 200 }}
                      appear={false}
                    >
                      {tagChild}
                    </TweenOneGroup>
                  </div>
                  </div>
              </div>
            </div>
            <hr className='text-black-50 border-secondary'/>
            <div className="row"><div className="col"><div className='d-flex justify-content-center align-items-center'><h6>compatibility:</h6></div></div></div>
            <div className='d-flex justify-content-center align-items-center'>
            <Rate disabled value={infoUser} />
            </div>
          </div>
          </Drawer>
      {redirect ? <Redirect to={redirect}/> : 
      <div>
        <div className='CardsPeople-div-container'>
        <div className="wrapper">
        {people.map(({avatar, first_name, last_name, email, id}: any) => {
            return (
          <div className="card-person" onClick={() => {
                showDrawer(id);
              }}>
            <div className='p-3'>
            <img src={avatar} className="card-img-top text-center justify-content-center rounded-circle" alt="..."></img>  
            </div>
            <div className="card-body">
            <h5 className="card-title text-center">{first_name} {last_name}</h5>
            <p className="card-text text-center">{email}</p>
            </div>
          </div>
          );
        })}
          </div>
        </div>
      </div>
      }
    </div>
  )
}