/* tslint:disable:no-unused-variable */
import { MessagesService } from './messages.service';
import { MyMessage } from '../services-models/my-message';

describe('MessagesService', () => {
    let component:MessagesService;
  
    beforeEach(() => {
      component = new MessagesService();
    });
  
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should return Update message if call setOKPutMessage', ()=>{
        let result: MyMessage;
        component.getMessage$.subscribe(m => result = m);
        component.setOKPutMessage();
        let message = new MyMessage(false, "Обновленно!");

        expect(result).toEqual(message);
    })

    it('should return Adding message if call setOKPostMessage', ()=>{
        let result: MyMessage;
        component.getMessage$.subscribe(m => result = m);
        component.setOKPostMessage();
        let message =new MyMessage(false, "Добавленно!");

        expect(result).toEqual(message);
    })

    it('should return Delete message if call setOKDelMessage', ()=>{
        let result: MyMessage;
        component.getMessage$.subscribe(m => result = m);
        component.setOKDelMessage();
        let message = new MyMessage(false, "Удалено!");

        expect(result).toEqual(message);
    })

    it('should return Logon message if call setOKLogoninMessage', ()=>{
        let result: MyMessage;
        component.getMessage$.subscribe(m => result = m);
        component.setOKLogoninMessage();
        let message = new MyMessage(false, "Вход выполнен!");

        expect(result).toEqual(message);
    })

    it('should return users message if call setMessage', ()=>{
        let result: MyMessage;
        let message = new MyMessage(true, "Сообщение!");
        component.getMessage$.subscribe(m => result = m);
        component.setMessage(message);

        expect(result).toEqual(message);
    })
});