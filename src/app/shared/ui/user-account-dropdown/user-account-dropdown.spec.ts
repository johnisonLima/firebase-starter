import { ComponentFixture, TestBed } from '@angular/core/testing';
import { afterEach } from 'vitest';
import { UserAccountDropdown, UserAccountDropdownUser } from './user-account-dropdown';

function interceptNextAnimationFrame() {
  let callback: FrameRequestCallback | undefined;
  const frameId = 431;
  const request = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((frameCallback) => {
    callback = frameCallback;
    return frameId;
  });
  const cancel = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation(() => undefined);

  return {
    frameId,
    request,
    cancel,
    run: () => callback?.(0),
  };
}

describe('UserAccountDropdown', () => {
  let component: UserAccountDropdown;
  let fixture: ComponentFixture<UserAccountDropdown>;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultUser: UserAccountDropdownUser = {
    name: 'João da Silva',
    email: 'joao@email.com',
    photoURL: 'https://example.com/photo.jpg',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserAccountDropdown],
    }).compileComponents();

    fixture = TestBed.createComponent(UserAccountDropdown);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('user', defaultUser);
    fixture.detectChanges();
  });

  describe('Criação e exibição', () => {
    it('deve criar o componente', () => {
      expect(component).toBeTruthy();
    });

    it('deve exibir o nome do usuário quando disponível', () => {
      expect(component.displayName()).toBe('João da Silva');
      const nameEl = fixture.nativeElement.querySelector('.user-account-dropdown__name');
      expect(nameEl?.textContent.trim()).toBe('João da Silva');
    });

    it('deve utilizar o e-mail como fallback quando o nome estiver vazio', () => {
      fixture.componentRef.setInput('user', {
        name: '',
        email: 'fallback@email.com',
        photoURL: null,
      });
      fixture.detectChanges();

      expect(component.displayName()).toBe('fallback@email.com');
      const nameEl = fixture.nativeElement.querySelector('.user-account-dropdown__name');
      expect(nameEl?.textContent.trim()).toBe('fallback@email.com');
    });
  });

  describe('Acessibilidade e semântica ARIA', () => {
    it('não deve possuir atributo aria-controls no botão de abertura', () => {
      const trigger = fixture.nativeElement.querySelector('.user-account-dropdown__trigger');
      expect(trigger.getAttribute('aria-controls')).toBeNull();
    });

    it('deve possuir aria-haspopup="menu" no botão de abertura', () => {
      const trigger = fixture.nativeElement.querySelector('.user-account-dropdown__trigger');
      expect(trigger.getAttribute('aria-haspopup')).toBe('menu');
    });

    it('deve alternar aria-expanded conforme estado de abertura', () => {
      const trigger = fixture.nativeElement.querySelector('.user-account-dropdown__trigger');
      expect(trigger.getAttribute('aria-expanded')).toBe('false');

      component.open();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('true');

      component.close();
      fixture.detectChanges();
      expect(trigger.getAttribute('aria-expanded')).toBe('false');
    });

    it('deve renderizar as imagens de avatar com alt="" como decorativas', () => {
      const triggerAvatar = fixture.nativeElement.querySelector('.user-account-dropdown__avatar');
      expect(triggerAvatar).toBeTruthy();
      expect(triggerAvatar.getAttribute('alt')).toBe('');

      component.open();
      fixture.detectChanges();

      const headerAvatar = fixture.nativeElement.querySelector(
        '.user-account-dropdown__header .user-account-dropdown__avatar'
      );
      expect(headerAvatar).toBeTruthy();
      expect(headerAvatar.getAttribute('alt')).toBe('');
    });

    it('deve manter o cabeçalho fora do elemento role="menu"', () => {
      component.open();
      fixture.detectChanges();

      const menu = fixture.nativeElement.querySelector('[role="menu"]');
      const header = fixture.nativeElement.querySelector('.user-account-dropdown__header');

      expect(menu).toBeTruthy();
      expect(header).toBeTruthy();
      expect(menu.contains(header)).toBe(false);
    });

    it('deve manter as opções interativas dentro de role="menu" com role="menuitem"', () => {
      component.open();
      fixture.detectChanges();

      const menu = fixture.nativeElement.querySelector('[role="menu"]');
      const menuItems = menu.querySelectorAll('[role="menuitem"]');

      expect(menuItems.length).toBe(3);
    });

    it('deve manter separadores dentro do menu com role="separator"', () => {
      component.open();
      fixture.detectChanges();

      const separators = fixture.nativeElement.querySelectorAll('.user-account-dropdown__separator');
      expect(separators.length).toBeGreaterThan(0);
      separators.forEach((sep: HTMLElement) => {
        expect(sep.getAttribute('role')).toBe('separator');
      });
    });
  });

  describe('Abertura, fechamento e clique externo', () => {
    it('deve alternar estado com toggle()', () => {
      expect(component.isOpen()).toBe(false);

      component.toggle();
      expect(component.isOpen()).toBe(true);

      component.toggle();
      expect(component.isOpen()).toBe(false);
    });

    it('deve fechar ao clicar fora do componente', () => {
      component.open();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      const outsideElement = document.createElement('div');
      document.body.appendChild(outsideElement);

      const pointerEvent = new PointerEvent('pointerdown', { bubbles: true });
      outsideElement.dispatchEvent(pointerEvent);

      expect(component.isOpen()).toBe(false);
      outsideElement.remove();
    });

    it('não deve fechar ao clicar dentro do componente', () => {
      component.open();
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);

      const trigger = fixture.nativeElement.querySelector('.user-account-dropdown__trigger');
      const pointerEvent = new PointerEvent('pointerdown', { bubbles: true });
      trigger.dispatchEvent(pointerEvent);

      expect(component.isOpen()).toBe(true);
    });
  });

  describe('Navegação e interações de teclado', () => {
    it('deve abrir o menu com ArrowDown no trigger', () => {
      const trigger = fixture.nativeElement.querySelector('.user-account-dropdown__trigger');
      const event = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      trigger.dispatchEvent(event);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isOpen()).toBe(true);
    });

    it('deve abrir o menu com ArrowUp no trigger', () => {
      const trigger = fixture.nativeElement.querySelector('.user-account-dropdown__trigger');
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      trigger.dispatchEvent(event);
      fixture.detectChanges();

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isOpen()).toBe(true);
    });

    it('deve fechar o menu com Escape e restaurar foco no trigger', () => {
      component.open();
      fixture.detectChanges();

      const triggerBtn = component.trigger()?.nativeElement;
      const triggerFocusSpy = triggerBtn ? vi.spyOn(triggerBtn, 'focus') : undefined;

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onMenuKeydown(event);

      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(component.isOpen()).toBe(false);
      if (triggerFocusSpy) {
        expect(triggerFocusSpy).toHaveBeenCalled();
      }
    });

    it('deve fechar o menu com Tab sem chamar preventDefault()', () => {
      component.open();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Tab', cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onMenuKeydown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component.isOpen()).toBe(false);
    });

    it('deve fechar o menu com Shift+Tab sem chamar preventDefault()', () => {
      component.open();
      fixture.detectChanges();

      const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, cancelable: true });
      const preventDefaultSpy = vi.spyOn(event, 'preventDefault');

      component.onMenuKeydown(event);

      expect(preventDefaultSpy).not.toHaveBeenCalled();
      expect(component.isOpen()).toBe(false);
    });

    it('deve concluir o fechamento pendente ao pressionar Escape', () => {
      component.open();
      fixture.detectChanges();
      const trigger = component.trigger()?.nativeElement;
      const focusSpy = trigger ? vi.spyOn(trigger, 'focus') : undefined;
      const frame = interceptNextAnimationFrame();

      component.onMenuKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
      expect(component.isOpen()).toBe(false);
      expect(component.isMenuRendered()).toBe(true);

      component.onMenuKeydown(new KeyboardEvent('keydown', { key: 'Escape' }));
      fixture.detectChanges();

      expect(component.isOpen()).toBe(false);
      expect(component.isMenuRendered()).toBe(false);
      expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();
      expect(frame.cancel).toHaveBeenCalledWith(frame.frameId);
      expect(focusSpy).toHaveBeenCalled();

      frame.run();
      fixture.detectChanges();
      expect(component.isMenuRendered()).toBe(false);
    });

    it('deve invalidar o fechamento pendente ao reabrir pelo trigger', async () => {
      component.open();
      fixture.detectChanges();
      await fixture.whenStable();

      const frame = interceptNextAnimationFrame();
      component.onMenuKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
      const staleCallback = frame.request.mock.calls[0][0];

      component.trigger()?.nativeElement.click();
      fixture.detectChanges();

      expect(component.isOpen()).toBe(true);
      expect(component.isMenuRendered()).toBe(true);
      expect(frame.cancel).toHaveBeenCalledWith(frame.frameId);

      staleCallback(0);
      fixture.detectChanges();
      expect(component.isOpen()).toBe(true);
      expect(component.isMenuRendered()).toBe(true);
      expect(fixture.nativeElement.querySelector('[role="menu"]')).not.toBeNull();

      frame.request.mockRestore();
      frame.cancel.mockRestore();
      await fixture.whenStable();
      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
      expect(document.activeElement).toBe(items[0]);
    });

    it('deve concluir o fechamento pendente se uma opção for selecionada', () => {
      component.open();
      fixture.detectChanges();
      const frame = interceptNextAnimationFrame();
      const accountSpy = vi.fn();
      component.accountClick.subscribe(accountSpy);

      component.onMenuKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
      const accountItem = fixture.nativeElement.querySelector(
        '[role="menuitem"]'
      ) as HTMLButtonElement;
      accountItem.click();
      fixture.detectChanges();

      expect(accountSpy).toHaveBeenCalledOnce();
      expect(component.isOpen()).toBe(false);
      expect(component.isMenuRendered()).toBe(false);
      expect(fixture.nativeElement.querySelector('[role="menu"]')).toBeNull();
      expect(frame.cancel).toHaveBeenCalledWith(frame.frameId);

      frame.run();
      expect(component.isMenuRendered()).toBe(false);
    });

    it('deve cancelar o frame pendente ao destruir o componente', () => {
      component.open();
      fixture.detectChanges();
      const frame = interceptNextAnimationFrame();

      component.onMenuKeydown(new KeyboardEvent('keydown', { key: 'Tab' }));
      const staleCallback = frame.request.mock.calls[0][0];

      fixture.destroy();

      expect(component.isOpen()).toBe(false);
      expect(component.isMenuRendered()).toBe(false);
      expect(frame.cancel).toHaveBeenCalledWith(frame.frameId);

      staleCallback(0);
      expect(component.isMenuRendered()).toBe(false);
    });

    it('deve navegar para o próximo item com ArrowDown (circular)', () => {
      component.open();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLButtonElement>;
      const item1FocusSpy = vi.spyOn(items[1], 'focus');
      const item2FocusSpy = vi.spyOn(items[2], 'focus');
      const item0FocusSpy = vi.spyOn(items[0], 'focus');

      // Foco no item 0 -> ArrowDown foca o item 1
      items[0].focus();
      const event1 = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
      component.onMenuKeydown(event1);
      expect(item1FocusSpy).toHaveBeenCalled();

      // Foco no item 1 -> ArrowDown foca o item 2
      items[1].focus();
      const event2 = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
      component.onMenuKeydown(event2);
      expect(item2FocusSpy).toHaveBeenCalled();

      // Foco no último item (2) -> ArrowDown circula para o item 0
      items[2].focus();
      const event3 = new KeyboardEvent('keydown', { key: 'ArrowDown', cancelable: true });
      component.onMenuKeydown(event3);
      expect(item0FocusSpy).toHaveBeenCalled();
    });

    it('deve navegar para o item anterior com ArrowUp (circular incluindo índice <= 0)', () => {
      component.open();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLButtonElement>;
      const lastItemSpy = vi.spyOn(items[2], 'focus');

      // Foco no item 0 -> deve circular para o último (índice 2)
      items[0].focus();
      const event = new KeyboardEvent('keydown', { key: 'ArrowUp', cancelable: true });
      component.onMenuKeydown(event);
      expect(lastItemSpy).toHaveBeenCalled();
    });

    it('deve focar o primeiro item com a tecla Home', () => {
      component.open();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLButtonElement>;
      const firstItemSpy = vi.spyOn(items[0], 'focus');

      items[2].focus();
      const event = new KeyboardEvent('keydown', { key: 'Home', cancelable: true });
      component.onMenuKeydown(event);
      expect(firstItemSpy).toHaveBeenCalled();
    });

    it('deve focar o último item com a tecla End', () => {
      component.open();
      fixture.detectChanges();

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]') as NodeListOf<HTMLButtonElement>;
      const lastItemSpy = vi.spyOn(items[2], 'focus');

      items[0].focus();
      const event = new KeyboardEvent('keydown', { key: 'End', cancelable: true });
      component.onMenuKeydown(event);
      expect(lastItemSpy).toHaveBeenCalled();
    });
  });

  describe('Emissão de eventos', () => {
    it('deve fechar o menu e emitir accountClick ao clicar em Minha conta', () => {
      component.open();
      fixture.detectChanges();

      const accountSpy = vi.fn();
      component.accountClick.subscribe(accountSpy);

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
      (items[0] as HTMLButtonElement).click();

      expect(accountSpy).toHaveBeenCalled();
      expect(component.isOpen()).toBe(false);
    });

    it('deve fechar o menu e emitir appearanceClick ao clicar em Preferências', () => {
      component.open();
      fixture.detectChanges();

      const appearanceSpy = vi.fn();
      component.appearanceClick.subscribe(appearanceSpy);

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
      (items[1] as HTMLButtonElement).click();

      expect(appearanceSpy).toHaveBeenCalled();
      expect(component.isOpen()).toBe(false);
    });

    it('deve fechar o menu e emitir logoutClick ao clicar em Sair', () => {
      component.open();
      fixture.detectChanges();

      const logoutSpy = vi.fn();
      component.logoutClick.subscribe(logoutSpy);

      const items = fixture.nativeElement.querySelectorAll('[role="menuitem"]');
      (items[2] as HTMLButtonElement).click();

      expect(logoutSpy).toHaveBeenCalled();
      expect(component.isOpen()).toBe(false);
    });
  });
});
