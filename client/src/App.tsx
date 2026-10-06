import { useEffect, useState, FormEvent, ReactNode } from 'react';
import {
  Routes,
  Route,
  Link,
  NavLink,
  Navigate,
  useNavigate,
  useLocation
} from 'react-router-dom';
import {
  Car,
  Menu,
  X,
  Droplets,
  ShieldCheck,
  MapPin,
  Phone,
  CheckCircle2
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { api, Provider, useApp } from './api';

const inr = (n: number) => '₹' + n.toLocaleString('en-IN');

const NAV = [
  ['/', 'Home'],
  ['/services', 'Services'],
  ['/subscriptions', 'Plans'],
  ['/track-booking', 'Track']
];

function Layout({ children }: { children: ReactNode }) {
  const [o, setO] = useState(false);
  const { user, logout } = useApp();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => setO(false), [loc.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-40 bg-navy text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold">
            <Car className="text-accent" />
            AutoShine
          </Link>

          <nav className="hidden gap-6 md:flex" aria-label="Main">
            {NAV.map(([p, l]) => (
              <NavLink key={p} to={p} className="hover:text-accent">
                {l}
              </NavLink>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <>
                <Link
                  to={
                    user.role === 'admin'
                      ? '/admin'
                      : user.role === 'technician'
                        ? '/technician'
                        : '/dashboard'
                  }
                  className="hover:text-accent"
                >
                  Dashboard
                </Link>

                <button
                  onClick={() => {
                    logout();
                    nav('/');
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login">Login</Link>
            )}

            <Link to="/book" className="btn !py-2">
              Book Now
            </Link>
          </div>

          <button
            className="md:hidden"
            aria-label="Toggle menu"
            onClick={() => setO(!o)}
          >
            {o ? <X /> : <Menu />}
          </button>
        </div>

        {o && (
          <div className="space-y-3 border-t border-white/10 px-4 py-4 md:hidden">
            {NAV.map(([p, l]) => (
              <Link key={p} className="block" to={p}>
                {l}
              </Link>
            ))}

            {user ? (
              <button
                onClick={() => {
                  logout();
                  nav('/');
                }}
              >
                Logout
              </button>
            ) : (
              <Link className="block" to="/login">
                Login
              </Link>
            )}

            <Link to="/book" className="btn w-full">
              Book Now
            </Link>
          </div>
        )}
      </header>

      <main className="flex-1">{children}</main>

      <a
        href="/book"
        className="btn fixed bottom-4 right-4 z-30 md:hidden"
      >
        Book Now
      </a>

      <footer className="bg-navy px-4 py-8 text-sm text-slate-300">
        <div className="mx-auto max-w-6xl">
          © AutoShine. Professional Car Care. At Your Doorstep. · Demo build –
          sample content only.
        </div>
      </footer>
    </div>
  );
}

function Home() {
  const [s, setS] = useState<any[]>([]);

  useEffect(() => {
    api('/services')
      .then(setS)
      .catch(() => {});
  }, []);

  return (
    <>
      <section className="bg-gradient-to-br from-navy to-slate-800 px-4 py-20 text-white">
        <div className="mx-auto max-w-6xl">
          <h1 className="text-4xl font-extrabold sm:text-6xl">
            Premium Car Care,
            <br />
            Right at Your Doorstep.
          </h1>

          <p className="mt-5 max-w-xl text-lg text-slate-300">
            Book a professional low-water car wash and interior vacuum
            service. Our trained car-care experts come to your location with
            everything needed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/book" className="btn">
              Book a Car Wash
            </Link>

            <Link to="/services" className="btn2">
              View Services
            </Link>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
            {[
              [MapPin, 'Doorstep Service'],
              [Droplets, 'Low-Water Cleaning'],
              [ShieldCheck, 'Verified Professionals'],
              [CheckCircle2, 'Easy Online Booking']
            ].map(([I, t]: any) => (
              <div
                key={t}
                className="flex items-center gap-2 rounded-xl bg-white/10 p-3"
              >
                <I className="text-accent" size={18} />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="mb-6 text-2xl font-bold">How it works</h2>

        <div className="grid gap-3 sm:grid-cols-5">
          {[
            'Book Online',
            'Choose Your Slot',
            'Technician Arrives',
            'We Clean Your Car',
            'Pay & Rate'
          ].map((t, i) => (
            <div className="card" key={t}>
              <b className="text-accent">0{i + 1}</b>
              <p className="font-semibold">{t}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <h2 className="mb-2 text-2xl font-bold">Low-water cleaning</h2>

        <p className="mb-6 text-slate-600">
          Our cleaning process is designed to minimize water usage compared
          with conventional car washing.
        </p>

        <Services list={s} />
      </section>
    </>
  );
}

function Services({ list }: { list?: any[] }) {
  const [s, setS] = useState<any[]>(list || []);

  useEffect(() => {
    if (!list) {
      api('/services')
        .then(setS)
        .catch(() => {});
    } else {
      setS(list);
    }
  }, [list]);

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {s.map((x) => (
        <div className="card flex flex-col" key={x.id}>
          <Droplets className="text-accent" />

          <h3 className="mt-2 font-bold">{x.name}</h3>

          <p className="flex-1 text-sm text-slate-600">
            {x.description}
          </p>

          <p className="mt-2 text-sm">
            {x.duration} min · from <b>{inr(x.price)}</b>
          </p>

          <Link to={`/book?service=${x.id}`} className="btn mt-3">
            Book Now
          </Link>
        </div>
      ))}
    </div>
  );
}

function Plans() {
  const [p, setP] = useState<any[]>([]);
  const { user, notify } = useApp();

  useEffect(() => {
    api('/subscriptions')
      .then(setP)
      .catch(() => {});
  }, []);

  return (
    <Page t="Monthly Plans">
      <div className="grid gap-4 md:grid-cols-3">
        {p.map((x) => (
          <div
            key={x.id}
            className={`card ${
              x.name === 'Smart' ? 'ring-2 ring-accent' : ''
            }`}
          >
            {x.name === 'Smart' && (
              <span className="rounded bg-accent px-2 py-0.5 text-xs text-white">
                Most Popular
              </span>
            )}

            <h3 className="text-xl font-bold">{x.name}</h3>

            <p className="text-3xl font-extrabold">
              {inr(x.price)}
              <small className="text-sm">/month</small>
            </p>

            <ul className="my-3 space-y-1 text-sm">
              {x.features.map((f: string) => (
                <li key={f}>✓ {f}</li>
              ))}
            </ul>

            <button
              className="btn w-full"
              onClick={() =>
                notify(
                  user
                    ? 'Demo mode: subscription checkout is simulated – no charge made'
                    : 'Please log in first',
                  !!user
                )
              }
            >
              Start Plan
            </button>
          </div>
        ))}
      </div>
    </Page>
  );
}

function Page({
  t,
  children
}: {
  t: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">{t}</h1>
      {children}
    </div>
  );
}

function Login() {
  const { login, notify } = useApp();
  const nav = useNavigate();
  const [reg, setReg] = useState(false);
  const [busy, setBusy] = useState(false);

  const go = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setBusy(true);

    /*
     * FIX:
     * FormData.entries() is not available in the current TypeScript
     * configuration, so we build the object using FormData.forEach().
     */
    const fd = new FormData(e.currentTarget);
    const f: Record<string, string> = {};

    fd.forEach((value, key) => {
      f[key] = String(value);
    });

    try {
      const d = await api(
        reg ? '/auth/register' : '/auth/login',
        {
          method: 'POST',
          body: f
        }
      );

      login(d);

      nav(
        d.user.role === 'admin'
          ? '/admin'
          : d.user.role === 'technician'
            ? '/technician'
            : '/dashboard'
      );
    } catch (x: any) {
      notify(x.message, false);
    }

    setBusy(false);
  };

  return (
    <Page t={reg ? 'Register' : 'Login'}>
      <form
        onSubmit={go}
        className="card mx-auto max-w-md space-y-3"
      >
        {reg && (
          <>
            <input
              className="inp"
              name="name"
              placeholder="Full name"
              required
            />

            <input
              className="inp"
              name="phone"
              placeholder="10-digit mobile"
              inputMode="numeric"
              required
            />
          </>
        )}

        <input
          className="inp"
          type="email"
          name="email"
          placeholder="Email"
          required
        />

        <input
          className="inp"
          type="password"
          name="password"
          placeholder="Password (8+ chars)"
          required
        />

        <button className="btn w-full" disabled={busy}>
          {busy
            ? 'Please wait…'
            : reg
              ? 'Create account'
              : 'Login'}
        </button>

        <button
          type="button"
          className="text-sm text-accent"
          onClick={() => setReg(!reg)}
        >
          {reg
            ? 'Have an account? Login'
            : 'New here? Register'}
        </button>
      </form>
    </Page>
  );
}

const STEPS = [
  'Vehicle',
  'Service',
  'Add-ons',
  'Location',
  'Slot',
  'Details',
  'Payment',
  'Confirm'
];

function Book() {
  const { notify, user } = useApp();
  const q = new URLSearchParams(useLocation().search);

  const [cfg, setCfg] = useState<any>(null);
  const [svc, setSvc] = useState<any[]>([]);
  const [st, setSt] = useState(0);
  const [busy, setBusy] = useState(false);
  const [slots, setSlots] = useState<any[]>([]);
  const [qt, setQt] = useState<any>(null);
  const [done, setDone] = useState<any>(null);

  const [f, setF] = useState<any>({
    vehicleType: 'Hatchback',
    vehicleModel: '',
    regNo: '',
    serviceId: +(q.get('service') || 1),
    addons: [],
    address: '',
    area: '',
    city: '',
    pincode: '',
    date: '',
    slot: '',
    name: user?.name || '',
    phone: '',
    email: user?.email || '',
    coupon: '',
    paymentMethod: 'UPI'
  });

  const set = (k: string, v: any) =>
    setF((p: any) => ({
      ...p,
      [k]: v
    }));

  useEffect(() => {
    api('/config')
      .then(setCfg)
      .catch((e) => notify(e.message, false));

    api('/services')
      .then(setSvc)
      .catch(() => {});
  }, []);

  const qkey = JSON.stringify([
    f.vehicleType,
    f.serviceId,
    f.addons,
    f.coupon
  ]);

  useEffect(() => {
    api('/quote', {
      method: 'POST',
      body: f
    })
      .then(setQt)
      .catch((e) => {
        setQt(null);

        if (f.coupon) {
          notify(e.message, false);
        }
      });
  }, [qkey]);

  useEffect(() => {
    if (f.date) {
      api('/slots?date=' + f.date)
        .then(setSlots)
        .catch(() => {});
    }
  }, [f.date]);

  const valid = [
    () => f.vehicleModel.trim() && f.regNo.trim(),
    () => f.serviceId,
    () => true,
    () =>
      f.address.trim() &&
      f.city.trim() &&
      /^\d{6}$/.test(f.pincode),
    () => f.date && f.slot,
    () =>
      f.name.trim() &&
      /^\d{10}$/.test(f.phone),
    () => f.paymentMethod,
    () => true
  ][st]();

  const geo = () =>
    navigator.geolocation
      ? navigator.geolocation.getCurrentPosition(
          (p) => {
            set(
              'address',
              `Lat ${p.coords.latitude.toFixed(
                4
              )}, Lng ${p.coords.longitude.toFixed(
                4
              )} (please add full address)`
            );
          },
          () =>
            notify(
              'Location unavailable – enter address manually',
              false
            )
        )
      : notify(
          'Geolocation not supported – enter manually',
          false
        );

  const submit = async () => {
    setBusy(true);

    try {
      setDone(
        await api('/bookings', {
          method: 'POST',
          body: f
        })
      );

      setSt(7);
    } catch (e: any) {
      notify(e.message, false);
    }

    setBusy(false);
  };

  if (!cfg) {
    return (
      <Page t="Book a Car Wash">
        <div className="h-40 animate-pulse rounded-2xl bg-slate-200" />
      </Page>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-28 pt-6">
      <p className="text-sm text-slate-500">
        Step {st + 1}/8 · {STEPS[st]}
      </p>

      <div className="mb-5 h-2 rounded bg-slate-200">
        <div
          className="h-2 rounded bg-accent transition-all"
          style={{
            width: `${(st + 1) * 12.5}%`
          }}
        />
      </div>

      <div className="card space-y-3">
        {st === 0 && (
          <>
            <div className="grid grid-cols-2 gap-2">
              {Object.keys(cfg.adjustments).map((v) => (
                <button
                  key={v}
                  onClick={() => set('vehicleType', v)}
                  className={`rounded-xl border p-3 ${
                    f.vehicleType === v
                      ? 'border-accent bg-accent/10'
                      : ''
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>

            <input
              className="inp"
              placeholder="Brand / model"
              value={f.vehicleModel}
              onChange={(e) =>
                set('vehicleModel', e.target.value)
              }
            />

            <input
              className="inp"
              placeholder="Registration number"
              value={f.regNo}
              onChange={(e) =>
                set('regNo', e.target.value)
              }
            />
          </>
        )}

        {st === 1 &&
          svc.map((s) => (
            <button
              key={s.id}
              onClick={() => set('serviceId', s.id)}
              className={`w-full rounded-xl border p-3 text-left ${
                f.serviceId === s.id
                  ? 'border-accent bg-accent/10'
                  : ''
              }`}
            >
              <b>{s.name}</b> · {inr(s.price)}
              <br />
              <span className="text-sm text-slate-500">
                {s.duration} min
              </span>
            </button>
          ))}

        {st === 2 &&
          Object.entries(cfg.addons).map(
            ([a, p]: any) => (
              <label
                key={a}
                className="flex items-center justify-between rounded-xl border p-3"
              >
                <span>
                  <input
                    type="checkbox"
                    className="mr-2"
                    checked={f.addons.includes(a)}
                    onChange={(e) =>
                      set(
                        'addons',
                        e.target.checked
                          ? [...f.addons, a]
                          : f.addons.filter(
                              (x: string) => x !== a
                            )
                      )
                    }
                  />
                  {a}
                </span>

                +{inr(p)}
              </label>
            )
          )}

        {st === 3 && (
          <>
            <button
              className="btn2 w-full"
              onClick={geo}
            >
              <MapPin size={16} />
              Use My Location
            </button>

            <input
              className="inp"
              placeholder="Full address"
              value={f.address}
              onChange={(e) =>
                set('address', e.target.value)
              }
            />

            <input
              className="inp"
              placeholder="Area"
              value={f.area}
              onChange={(e) =>
                set('area', e.target.value)
              }
            />

            <input
              className="inp"
              placeholder="City"
              value={f.city}
              onChange={(e) =>
                set('city', e.target.value)
              }
            />

            <input
              className="inp"
              placeholder="Pincode (6 digits)"
              inputMode="numeric"
              value={f.pincode}
              onChange={(e) =>
                set('pincode', e.target.value)
              }
            />

            <div className="rounded-xl bg-slate-100 p-4 text-center text-sm text-slate-500">
              Map placeholder – plug in Google Maps/Mapbox
              later
            </div>
          </>
        )}

        {st === 4 && (
          <>
            <input
              type="date"
              className="inp"
              min={new Date()
                .toISOString()
                .slice(0, 10)}
              value={f.date}
              onChange={(e) => {
                set('date', e.target.value);
                set('slot', '');
              }}
            />

            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => (
                <button
                  key={s.slot}
                  disabled={!s.available}
                  onClick={() =>
                    set('slot', s.slot)
                  }
                  className={`rounded-xl border p-3 disabled:bg-slate-100 disabled:text-slate-400 disabled:line-through ${
                    f.slot === s.slot
                      ? 'border-accent bg-accent/10'
                      : ''
                  }`}
                >
                  {s.slot}
                </button>
              ))}
            </div>
          </>
        )}

        {st === 5 && (
          <>
            <input
              className="inp"
              placeholder="Name"
              value={f.name}
              onChange={(e) =>
                set('name', e.target.value)
              }
            />

            <input
              className="inp"
              placeholder="Mobile (10 digits)"
              inputMode="numeric"
              value={f.phone}
              onChange={(e) =>
                set('phone', e.target.value)
              }
            />

            <input
              className="inp"
              type="email"
              placeholder="Email"
              value={f.email}
              onChange={(e) =>
                set('email', e.target.value)
              }
            />
          </>
        )}

        {st === 6 && (
          <>
            <input
              className="inp"
              placeholder="Coupon (try WELCOME100)"
              value={f.coupon}
              onChange={(e) =>
                set(
                  'coupon',
                  e.target.value.toUpperCase()
                )
              }
            />

            {qt && (
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  {inr(qt.subtotal)}
                </div>

                <div className="flex justify-between">
                  <span>Discount</span>
                  -{inr(qt.discount)}
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  {inr(qt.tax)}
                </div>

                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  {inr(qt.total)}
                </div>
              </div>
            )}

            <select
              className="inp"
              value={f.paymentMethod}
              onChange={(e) =>
                set('paymentMethod', e.target.value)
              }
            >
              {['UPI', 'Card', 'Cash on Service'].map(
                (m) => (
                  <option key={m}>{m}</option>
                )
              )}
            </select>

            {f.paymentMethod !== 'Cash on Service' && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                DEMO PAYMENT – no real money is charged
                and no payment is processed.
              </p>
            )}
          </>
        )}

        {st === 7 && done && (
          <div className="space-y-1">
            <CheckCircle2
              className="text-accent"
              size={36}
            />

            <h2 className="text-xl font-bold">
              Booking {done.id}
            </h2>

            <p>
              {done.service} · {f.vehicleType}{' '}
              {f.vehicleModel} ({f.regNo})
            </p>

            <p>
              {f.date}, {f.slot}
            </p>

            <p>
              {f.address}, {f.city}
            </p>

            <p>
              Total: <b>{inr(done.total)}</b>
            </p>

            <div className="flex flex-wrap gap-2 pt-3">
              <Link
                className="btn"
                to="/track-booking"
              >
                Track Booking
              </Link>

              <button
                className="btn2"
                onClick={() => window.print()}
              >
                Download Receipt
              </button>

              <Link className="btn2" to="/">
                Home
              </Link>
            </div>
          </div>
        )}
      </div>

      {st < 7 && (
        <div className="fixed inset-x-0 bottom-0 flex gap-2 border-t bg-white p-3">
          <button
            className="btn2"
            disabled={st === 0}
            onClick={() => setSt(st - 1)}
          >
            Back
          </button>

          <button
            className="btn flex-1"
            disabled={!valid || busy}
            onClick={() =>
              st === 6
                ? submit()
                : setSt(st + 1)
            }
          >
            {busy
              ? 'Booking…'
              : st === 6
                ? `Confirm — ${inr(qt?.total || 0)}`
                : `Continue${
                    qt
                      ? ` — ${inr(qt.total)}`
                      : ''
                  }`}
          </button>
        </div>
      )}
    </div>
  );
}

const TL = [
  'Confirmed',
  'Assigned',
  'Accepted',
  'On The Way',
  'Arrived',
  'Cleaning',
  'Completed'
];

function Track() {
  const { notify } = useApp();
  const [b, setB] = useState<any>(null);

  const go = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const f = new FormData(e.currentTarget);

    try {
      setB(
        await api(
          `/bookings/track?id=${encodeURIComponent(
            String(f.get('id'))
          )}&mobile=${f.get('mobile')}`
        )
      );
    } catch (x: any) {
      setB(null);
      notify(x.message, false);
    }
  };

  return (
    <Page t="Track Booking">
      <form
        onSubmit={go}
        className="card mb-5 grid max-w-xl gap-3 sm:grid-cols-3"
      >
        <input
          className="inp"
          name="id"
          placeholder="Booking ID"
          required
        />

        <input
          className="inp"
          name="mobile"
          placeholder="Mobile"
          required
        />

        <button className="btn">Track</button>
      </form>

      {b && (
        <div className="card max-w-xl">
          <p className="font-bold">
            {b.id} · {b.service}
          </p>

          <ol className="my-3 space-y-2">
            {TL.map((t, i) => (
              <li
                key={t}
                className={
                  TL.indexOf(b.status) >= i
                    ? 'font-semibold text-accent'
                    : 'text-slate-400'
                }
              >
                ● {t}
              </li>
            ))}
          </ol>

          {b.status === 'Cancelled' && (
            <p className="text-red-600">
              Cancelled
            </p>
          )}

          {b.tech && (
            <p className="text-sm">
              Technician: {b.tech} · ★ {b.tech_rating}
            </p>
          )}
        </div>
      )}
    </Page>
  );
}

function Dash() {
  const { user, notify } = useApp();
  const [rows, setRows] = useState<any[]>([]);
  const [m, setM] = useState<any>(null);
  const [load, setLoad] = useState(true);

  const role = user.role;

  const ld = () => {
    setLoad(true);

    const p =
      role === 'customer'
        ? '/customer/bookings'
        : role === 'technician'
          ? '/technician/jobs'
          : '/admin/bookings';

    api(p)
      .then(setRows)
      .catch((e) => notify(e.message, false))
      .finally(() => setLoad(false));

    if (role === 'admin') {
      api('/admin/dashboard')
        .then(setM)
        .catch(() => {});
    }
  };

  useEffect(ld, []);

  const act = async (fn: () => Promise<any>) => {
    try {
      await fn();
      notify('Updated');
      ld();
    } catch (e: any) {
      notify(e.message, false);
    }
  };

  const next = (b: any) =>
    act(() =>
      api(`/technician/jobs/${b.id}/status`, {
        method: 'PATCH',
        body: {
          checklist: Object.fromEntries(
            [
              'exterior',
              'windows',
              'tyres',
              'interior',
              'dashboard',
              'addons'
            ].map((k) => [
              k,
              b.status === 'Cleaning' &&
                confirm(
                  'Confirm ALL checklist items done (exterior, windows, tyres, interior, dashboard, add-ons)?'
                )
            ])
          )
        }
      })
    );

  const NEXT: any = {
    Assigned: 'Accept Job',
    Accepted: 'On The Way',
    'On The Way': 'Arrived',
    Arrived: 'Start Cleaning',
    Cleaning: 'Complete Job'
  };

  return (
    <Page
      t={
        role === 'admin'
          ? 'Admin Dashboard'
          : role === 'technician'
            ? 'Technician Dashboard'
            : 'My Bookings'
      }
    >
      {m && (
        <>
          <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              ['Today', m.today],
              ['Revenue', inr(m.revenue)],
              ['Pending', m.pending],
              ['Completed', m.completed],
              ['Cancelled', m.cancelled],
              ['Customers', m.customers]
            ].map(([k, v]) => (
              <div className="card" key={k as string}>
                <p className="text-sm text-slate-500">
                  {k}
                </p>

                <p className="text-2xl font-bold">
                  {v}
                </p>
              </div>
            ))}
          </div>

          <div className="card mb-5 h-56">
            <ResponsiveContainer>
              <BarChart data={m.series}>
                <XAxis dataKey="date" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar
                  dataKey="bookings"
                  fill="#10b981"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}

      {load ? (
        <div className="h-24 animate-pulse rounded-2xl bg-slate-200" />
      ) : rows.length === 0 ? (
        <div className="card text-center">
          No bookings yet.{' '}
          <Link
            className="text-accent"
            to="/book"
          >
            Book a car wash
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map((b) => (
            <div
              className="card flex flex-wrap items-center justify-between gap-3"
              key={b.id}
            >
              <div>
                <p className="font-bold">
                  {b.id}{' '}
                  <span className="rounded bg-slate-100 px-2 py-0.5 text-xs">
                    {b.status}
                  </span>
                </p>

                <p className="text-sm text-slate-600">
                  {b.service} · {b.vehicle_type}{' '}
                  {b.vehicle_model} · {b.date}{' '}
                  {b.slot}
                </p>

                <p className="text-sm text-slate-500">
                  {b.name}, {b.address}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {role === 'customer' &&
                  ![
                    'Completed',
                    'Cancelled'
                  ].includes(b.status) && (
                    <button
                      className="btn2"
                      onClick={() =>
                        confirm('Cancel booking?') &&
                        act(() =>
                          api(
                            '/bookings/' + b.id,
                            {
                              method: 'PATCH',
                              body: {}
                            }
                          )
                        )
                      }
                    >
                      Cancel
                    </button>
                  )}

                {role === 'customer' &&
                  b.status === 'Completed' && (
                    <button
                      className="btn2"
                      onClick={() => {
                        const r = prompt(
                          'Rating 1-5'
                        );

                        if (r) {
                          act(() =>
                            api('/reviews', {
                              method: 'POST',
                              body: {
                                bookingId: b.id,
                                rating: +r,
                                text: ''
                              }
                            })
                          );
                        }
                      }}
                    >
                      Rate
                    </button>
                  )}

                {role === 'technician' &&
                  NEXT[b.status] && (
                    <>
                      <a
                        className="btn2"
                        href={`tel:${b.phone}`}
                      >
                        <Phone size={16} />
                        Call
                      </a>

                      <button
                        className="btn"
                        onClick={() => next(b)}
                      >
                        {NEXT[b.status]}
                      </button>
                    </>
                  )}

                {role === 'admin' && (
                  <>
                    {m &&
                      ![
                        'Completed',
                        'Cancelled'
                      ].includes(b.status) && (
                        <select
                          className="inp !w-auto"
                          defaultValue=""
                          onChange={(e) =>
                            e.target.value &&
                            act(() =>
                              api(
                                '/admin/assign-technician',
                                {
                                  method: 'POST',
                                  body: {
                                    bookingId: b.id,
                                    technicianId:
                                      +e.target.value
                                  }
                                }
                              )
                            )
                          }
                        >
                          <option value="">
                            Assign…
                          </option>

                          {m.technicians
                            .filter(
                              (t: any) =>
                                t.status ===
                                'Available'
                            )
                            .map((t: any) => (
                              <option
                                key={t.id}
                                value={t.id}
                              >
                                {t.name}
                              </option>
                            ))}
                        </select>
                      )}

                    {b.status !== 'Cancelled' && (
                      <button
                        className="btn2"
                        onClick={() =>
                          act(() =>
                            api(
                              '/admin/bookings/' +
                                b.id,
                              {
                                method: 'PATCH',
                                body: {
                                  status:
                                    'Cancelled'
                                }
                              }
                            )
                          )
                        }
                      >
                        Cancel
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}

const Guard = ({
  roles,
  children
}: {
  roles: string[];
  children: ReactNode;
}) => {
  const { user } = useApp();

  return !user ? (
    <Navigate to="/login" />
  ) : roles.includes(user.role) ? (
    <>{children}</>
  ) : (
    <Navigate to="/" />
  );
};

const Static = ({ t }: { t: string }) => (
  <Page t={t}>
    <p className="max-w-2xl text-slate-600">
      Sample {t.toLowerCase()} content for the demo build.
      Replace with your reviewed legal/business text before
      launch.
    </p>
  </Page>
);

export default function App() {
  return (
    <Provider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route
            path="/services"
            element={
              <Page t="Services">
                <Services />
              </Page>
            }
          />

          <Route
            path="/pricing"
            element={
              <Page t="Pricing">
                <p className="mb-3">
                  Base wash: Hatchback ₹249 · Sedan ₹299 · SUV
                  ₹349 · Luxury ₹449. Add-ons from ₹99.
                </p>

                <Services />
              </Page>
            }
          />

          <Route
            path="/subscriptions"
            element={<Plans />}
          />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Login />} />

          <Route path="/book" element={<Book />} />

          <Route
            path="/booking-success"
            element={<Navigate to="/track-booking" />}
          />

          <Route
            path="/track-booking"
            element={<Track />}
          />

          {[
            ['how-it-works', 'How It Works'],
            ['about', 'About Us'],
            ['contact', 'Contact'],
            ['faq', 'FAQ'],
            ['terms', 'Terms & Conditions'],
            ['privacy', 'Privacy Policy'],
            ['refund-policy', 'Refund Policy']
          ].map(([p, t]) => (
            <Route
              key={p}
              path={'/' + p}
              element={<Static t={t} />}
            />
          ))}

          <Route
            path="/dashboard"
            element={
              <Guard roles={['customer']}>
                <Dash />
              </Guard>
            }
          />

          <Route
            path="/technician"
            element={
              <Guard roles={['technician']}>
                <Dash />
              </Guard>
            }
          />

          <Route
            path="/admin"
            element={
              <Guard roles={['admin']}>
                <Dash />
              </Guard>
            }
          />

          <Route
            path="*"
            element={
              <Page t="404 – Page not found">
                <Link className="btn" to="/">
                  Go home
                </Link>
              </Page>
            }
          />
        </Routes>
      </Layout>
    </Provider>
  );
}