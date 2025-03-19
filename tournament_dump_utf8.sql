--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Match; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Match" (
    id integer NOT NULL,
    "teamA" character varying NOT NULL,
    "teamB" character varying NOT NULL,
    played boolean,
    tournament_id integer,
    scheduledtime date,
    result character varying,
    round character varying,
    originalid character varying,
    CONSTRAINT "Match_status_check" CHECK (((played)::text = ANY (ARRAY[('scheduled'::character varying)::text, ('completed'::character varying)::text])))
);


ALTER TABLE public."Match" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Match_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Match_id_seq" OWNER TO postgres;

--
-- Name: Match_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Match_id_seq" OWNED BY public."Match".id;


--
-- Name: Team; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Team" (
    id_team integer NOT NULL,
    name character varying(100) NOT NULL,
    players jsonb,
    rating integer
);


ALTER TABLE public."Team" OWNER TO postgres;

--
-- Name: Team_id_team_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Team_id_team_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Team_id_team_seq" OWNER TO postgres;

--
-- Name: Team_id_team_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Team_id_team_seq" OWNED BY public."Team".id_team;


--
-- Name: Teammembers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Teammembers" (
    id_team integer NOT NULL,
    id_user integer NOT NULL
);


ALTER TABLE public."Teammembers" OWNER TO postgres;

--
-- Name: Tournament; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tournament" (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    description character varying(255),
    "startDate" timestamp with time zone NOT NULL,
    "endDate" timestamp with time zone,
    organizer character varying(255),
    discipline character varying(255) DEFAULT 'Unknown'::character varying NOT NULL,
    status character varying(255) DEFAULT 'upcoming'::character varying NOT NULL,
    teams jsonb,
    matches jsonb,
    "previousMatches" jsonb,
    judges jsonb
);


ALTER TABLE public."Tournament" OWNER TO postgres;

--
-- Name: Tournament_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public."Tournament_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tournament_id_seq" OWNER TO postgres;

--
-- Name: Tournament_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public."Tournament_id_seq" OWNED BY public."Tournament".id;


--
-- Name: Tournamentjudges; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tournamentjudges" (
    tournament_id integer NOT NULL,
    id_judge integer NOT NULL
);


ALTER TABLE public."Tournamentjudges" OWNER TO postgres;

--
-- Name: Tournamentorganizers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tournamentorganizers" (
    tournament_id integer NOT NULL,
    id_organizer integer NOT NULL
);


ALTER TABLE public."Tournamentorganizers" OWNER TO postgres;

--
-- Name: Tournamentteams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Tournamentteams" (
    tournament_id integer NOT NULL,
    team_id integer NOT NULL
);


ALTER TABLE public."Tournamentteams" OWNER TO postgres;

--
-- Name: User role; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."User role" (
    id_role integer NOT NULL,
    name_role character varying NOT NULL
);


ALTER TABLE public."User role" OWNER TO postgres;

--
-- Name: Users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."Users" (
    id_user integer NOT NULL,
    username character varying,
    emal character varying,
    id_role integer,
    password character varying,
    nickname character varying
);


ALTER TABLE public."Users" OWNER TO postgres;

--
-- Name: invite_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invite_tokens (
    id integer NOT NULL,
    token character varying(500) NOT NULL,
    "organizerId" integer NOT NULL,
    role character varying(255) DEFAULT 'JUDGE'::character varying NOT NULL,
    used boolean DEFAULT false NOT NULL,
    "usedAt" timestamp with time zone,
    "usedBy" integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.invite_tokens OWNER TO postgres;

--
-- Name: invite_tokens_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invite_tokens_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invite_tokens_id_seq OWNER TO postgres;

--
-- Name: invite_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invite_tokens_id_seq OWNED BY public.invite_tokens.id;


--
-- Name: newtable; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.newtable (
);


ALTER TABLE public.newtable OWNER TO postgres;

--
-- Name: teams; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.teams (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    players jsonb NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.teams OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.teams_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.teams_id_seq OWNER TO postgres;

--
-- Name: teams_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.teams_id_seq OWNED BY public.teams.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    nickname character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    role character varying(255) DEFAULT 'PLAYER'::character varying NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Match id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match" ALTER COLUMN id SET DEFAULT nextval('public."Match_id_seq"'::regclass);


--
-- Name: Team id_team; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team" ALTER COLUMN id_team SET DEFAULT nextval('public."Team_id_team_seq"'::regclass);


--
-- Name: Tournament id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tournament" ALTER COLUMN id SET DEFAULT nextval('public."Tournament_id_seq"'::regclass);


--
-- Name: invite_tokens id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_tokens ALTER COLUMN id SET DEFAULT nextval('public.invite_tokens_id_seq'::regclass);


--
-- Name: teams id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams ALTER COLUMN id SET DEFAULT nextval('public.teams_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Match; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Match" (id, "teamA", "teamB", played, tournament_id, scheduledtime, result, round, originalid) FROM stdin;
\.


--
-- Data for Name: Team; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Team" (id_team, name, players, rating) FROM stdin;
\.


--
-- Data for Name: Teammembers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Teammembers" (id_team, id_user) FROM stdin;
\.


--
-- Data for Name: Tournament; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tournament" (id, name, description, "startDate", "endDate", organizer, discipline, status, teams, matches, "previousMatches", judges) FROM stdin;
2	TEST	TEST	2005-09-25 04:00:00+04	\N	\N	counterStrike2	upcoming	[]	[]	[]	[]
\.


--
-- Data for Name: Tournamentjudges; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tournamentjudges" (tournament_id, id_judge) FROM stdin;
\.


--
-- Data for Name: Tournamentorganizers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tournamentorganizers" (tournament_id, id_organizer) FROM stdin;
\.


--
-- Data for Name: Tournamentteams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Tournamentteams" (tournament_id, team_id) FROM stdin;
\.


--
-- Data for Name: User role; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."User role" (id_role, name_role) FROM stdin;
1	Admin
4	CAPTAIN
5	PLAYER
2	ORGANIZER
3	JUDGE
\.


--
-- Data for Name: Users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."Users" (id_user, username, emal, id_role, password, nickname) FROM stdin;
1	Lev	levkaflower@gmail.com	1	\N	\N
\.


--
-- Data for Name: invite_tokens; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invite_tokens (id, token, "organizerId", role, used, "usedAt", "usedBy", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: newtable; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.newtable  FROM stdin;
\.


--
-- Data for Name: teams; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.teams (id, name, players, "createdAt", "updatedAt") FROM stdin;
1	Navi	[{"name": "Aleksib", "role": "CAPTAIN"}, {"name": "jL", "role": "PLAYER"}, {"name": "wonderful", "role": "PLAYER"}, {"name": "iM", "role": "PLAYER"}, {"name": "b1t", "role": "PLAYER"}]	2025-02-27 17:42:09.491+03	2025-02-27 17:42:09.491+03
2	Team Spirit	[{"name": "chopper", "role": "CAPTAIN"}, {"name": "donk", "role": "PLAYER"}, {"name": "sh1ro", "role": "PLAYER"}, {"name": "magixx", "role": "PLAYER"}, {"name": "zont1x", "role": "PLAYER"}]	2025-02-27 17:58:36.29+03	2025-02-27 17:58:36.29+03
3	Team Spirit	["chopper", "donk", "sh1ro", "magixx", "zont1x"]	2025-03-02 13:57:06.423+03	2025-03-02 13:57:06.423+03
4	Team Spirit	["chopper", "donk", "sh1ro", "magixx", "zont1x"]	2025-03-02 13:58:57.134+03	2025-03-02 13:58:57.134+03
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, username, nickname, password, email, role, "createdAt", "updatedAt") FROM stdin;
1	admin	╨Ю╤А╨│╨░╨╜╨╕╨╖╨░╤В╨╛╤А	$2b$10$z3KtW5QZBtH9cp.e7/J92eTYFzacY/iddYgW3UVgTLf983eTq0o4K	admin@example.com	ORGANIZER	2025-03-13 18:44:30.163+03	2025-03-13 18:44:30.163+03
\.


--
-- Name: Match_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Match_id_seq"', 1, false);


--
-- Name: Team_id_team_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Team_id_team_seq"', 1, false);


--
-- Name: Tournament_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."Tournament_id_seq"', 2, true);


--
-- Name: invite_tokens_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invite_tokens_id_seq', 1, false);


--
-- Name: teams_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.teams_id_seq', 4, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- Name: Match Match_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Match"
    ADD CONSTRAINT "Match_pkey" PRIMARY KEY (id);


--
-- Name: Team Team_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Team"
    ADD CONSTRAINT "Team_pkey" PRIMARY KEY (id_team);


--
-- Name: Tournament Tournament_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tournament"
    ADD CONSTRAINT "Tournament_pkey" PRIMARY KEY (id);


--
-- Name: invite_tokens invite_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_tokens
    ADD CONSTRAINT invite_tokens_pkey PRIMARY KEY (id);


--
-- Name: invite_tokens invite_tokens_token_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invite_tokens
    ADD CONSTRAINT invite_tokens_token_key UNIQUE (token);


--
-- Name: Users newtable_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Users"
    ADD CONSTRAINT newtable_pk PRIMARY KEY (id_user);


--
-- Name: Teammembers teammembers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Teammembers"
    ADD CONSTRAINT teammembers_pkey PRIMARY KEY (id_team, id_user);


--
-- Name: teams teams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.teams
    ADD CONSTRAINT teams_pkey PRIMARY KEY (id);


--
-- Name: Tournamentjudges tournamentjudges_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tournamentjudges"
    ADD CONSTRAINT tournamentjudges_pkey PRIMARY KEY (tournament_id, id_judge);


--
-- Name: Tournamentorganizers tournamentorganizers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tournamentorganizers"
    ADD CONSTRAINT tournamentorganizers_pkey PRIMARY KEY (tournament_id, id_organizer);


--
-- Name: Tournamentteams tournamentteams_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tournamentteams"
    ADD CONSTRAINT tournamentteams_pkey PRIMARY KEY (tournament_id, team_id);


--
-- Name: User role user_role_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."User role"
    ADD CONSTRAINT user_role_pk PRIMARY KEY (id_role);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: Tournamentjudges fk_judge; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tournamentjudges"
    ADD CONSTRAINT fk_judge FOREIGN KEY (id_judge) REFERENCES public."Users"(id_user) ON DELETE CASCADE;


--
-- Name: Tournamentorganizers fk_organizer; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Tournamentorganizers"
    ADD CONSTRAINT fk_organizer FOREIGN KEY (id_organizer) REFERENCES public."Users"(id_user) ON DELETE CASCADE;


--
-- Name: Teammembers fk_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."Teammembers"
    ADD CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES public."Users"(id_user) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

